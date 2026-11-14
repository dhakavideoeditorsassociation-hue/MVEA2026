import { createSeedRepository } from "./seed-repository";
import type { ContentRepository } from "./repository";

/**
 * Active content backend.
 *
 * Phase 2 will branch here: when the Firebase environment variables exist the
 * Firestore repository is returned, otherwise the seed repository keeps the
 * public site fully browsable (useful for local development and previews).
 */
export const repo: ContentRepository = createSeedRepository();

export * from "./repository";
