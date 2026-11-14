"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

export type SessionRole = "member" | "admin";

export type SessionUser = {
  uid: string;
  email: string;
  displayName: string;
  role: SessionRole;
  mode: "demo" | "firebase";
};

export type AuthErrorCode =
  | "invalid-credentials"
  | "email-in-use"
  | "weak-password"
  | "invalid-email"
  | "google-unavailable"
  | "generic";

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.code = code;
  }
}

const DEMO_USERS_KEY = "gvea.demo.users";
const SESSION_KEY = "gvea.session";

type DemoUser = {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  role: SessionRole;
};

const DEFAULT_DEMO_USERS: DemoUser[] = [
  {
    uid: "demo-admin",
    email: "admin@gvea.org",
    password: "Gvea@2026",
    displayName: "Committee Admin",
    role: "admin",
  },
  {
    uid: "demo-editor",
    email: "editor@gvea.org",
    password: "Gvea@2026",
    displayName: "Demo Editor",
    role: "member",
  },
];

function readDemoUsers(): DemoUser[] {
  try {
    const raw = window.localStorage.getItem(DEMO_USERS_KEY);
    if (!raw) {
      window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
      return DEFAULT_DEMO_USERS;
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DemoUser[]) : DEFAULT_DEMO_USERS;
  } catch {
    return DEFAULT_DEMO_USERS;
  }
}

function writeDemoUsers(users: DemoUser[]) {
  try {
    window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage disabled */
  }
}

function readSession(): SessionUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function writeSession(user: SessionUser | null) {
  try {
    if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage disabled */
  }
}

async function resolveFirebaseRole(userId: string): Promise<SessionRole> {
  try {
    const snapshot = await getDoc(doc(getFirebaseDb(), "users", userId));
    return snapshot.data()?.role === "admin" ? "admin" : "member";
  } catch {
    return "member";
  }
}

async function mapFirebaseUser(user: User): Promise<SessionUser> {
  return {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName?.trim() || user.email?.split("@")[0] || "Member",
    role: await resolveFirebaseRole(user.uid),
    mode: "firebase",
  };
}

type AuthContextValue = {
  user: SessionUser | null;
  ready: boolean;
  mode: "demo" | "firebase";
  login: (email: string, password: string) => Promise<SessionUser>;
  register: (input: { name: string; email: string; password: string }) => Promise<SessionUser>;
  loginWithGoogle: () => Promise<SessionUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const mode: "demo" | "firebase" = isFirebaseConfigured ? "firebase" : "demo";

  useEffect(() => {
    if (mode === "demo") {
      setUser(readSession());
      setReady(true);
      return;
    }

    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setReady(true);
        return;
      }
      setUser(await mapFirebaseUser(firebaseUser));
      setReady(true);
    });

    return () => unsubscribe();
  }, [mode]);

  const login = useCallback(
    async (email: string, password: string): Promise<SessionUser> => {
      const normalisedEmail = email.trim().toLowerCase();

      if (mode === "demo") {
        const match = readDemoUsers().find(
          (candidate) => candidate.email === normalisedEmail && candidate.password === password,
        );
        if (!match) throw new AuthError("invalid-credentials");
        const session: SessionUser = {
          uid: match.uid,
          email: match.email,
          displayName: match.displayName,
          role: match.role,
          mode: "demo",
        };
        writeSession(session);
        setUser(session);
        return session;
      }

      try {
        const credential = await signInWithEmailAndPassword(getFirebaseAuth(), normalisedEmail, password);
        const session = await mapFirebaseUser(credential.user);
        setUser(session);
        return session;
      } catch (error) {
        const code = (error as { code?: string }).code ?? "";
        if (code.includes("invalid-email")) throw new AuthError("invalid-email");
        throw new AuthError("invalid-credentials");
      }
    },
    [mode],
  );

  const register = useCallback(
    async ({ name, email, password }: { name: string; email: string; password: string }): Promise<SessionUser> => {
      const normalisedEmail = email.trim().toLowerCase();
      if (password.length < 8) throw new AuthError("weak-password");

      if (mode === "demo") {
        const users = readDemoUsers();
        if (users.some((candidate) => candidate.email === normalisedEmail)) throw new AuthError("email-in-use");
        const created: DemoUser = {
          uid: `demo-${Date.now()}`,
          email: normalisedEmail,
          password,
          displayName: name.trim() || normalisedEmail.split("@")[0],
          role: "member",
        };
        writeDemoUsers([...users, created]);
        const session: SessionUser = {
          uid: created.uid,
          email: created.email,
          displayName: created.displayName,
          role: "member",
          mode: "demo",
        };
        writeSession(session);
        setUser(session);
        return session;
      }

      try {
        const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), normalisedEmail, password);
        if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
        await setDoc(doc(getFirebaseDb(), "users", credential.user.uid), {
          email: normalisedEmail,
          displayName: name.trim(),
          role: "member",
          createdAt: new Date().toISOString(),
        });
        const session = await mapFirebaseUser(credential.user);
        setUser(session);
        return session;
      } catch (error) {
        const code = (error as { code?: string }).code ?? "";
        if (code.includes("email-already-in-use")) throw new AuthError("email-in-use");
        if (code.includes("weak-password")) throw new AuthError("weak-password");
        if (code.includes("invalid-email")) throw new AuthError("invalid-email");
        throw new AuthError("generic");
      }
    },
    [mode],
  );

  const loginWithGoogle = useCallback(async (): Promise<SessionUser> => {
    if (mode === "demo") throw new AuthError("google-unavailable");
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(getFirebaseAuth(), provider);
      const session = await mapFirebaseUser(credential.user);
      setUser(session);
      return session;
    } catch {
      throw new AuthError("generic");
    }
  }, [mode]);

  const logout = useCallback(async () => {
    if (mode === "demo") {
      writeSession(null);
      setUser(null);
      return;
    }
    await signOut(getFirebaseAuth());
    setUser(null);
  }, [mode]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready, mode, login, register, loginWithGoogle, logout }),
    [user, ready, mode, login, register, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
