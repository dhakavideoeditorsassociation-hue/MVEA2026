"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { HireRequestDialog } from "@/components/hire/hire-request-dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type HireRequestButtonProps = {
  member?: { id: string; name: string };
  label?: string;
  variant?: ButtonProps["variant"];
  className?: string;
};

/** Opens the 2-step Request Editor flow. */
export function HireRequestButton({ member, label, variant = "default", className }: HireRequestButtonProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size="sm" onClick={() => setOpen(true)} className={cn("gap-1.5", className)}>
        <Send className="h-3.5 w-3.5" aria-hidden />
        {label ?? t("hire.requestEditor")}
      </Button>
      <HireRequestDialog open={open} onClose={() => setOpen(false)} member={member} />
    </>
  );
}
