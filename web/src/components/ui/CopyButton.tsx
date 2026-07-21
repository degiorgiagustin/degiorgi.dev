"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";

// Icon-only copy-to-clipboard control (spec 005). A real <button>, not a
// link: it performs an action rather than navigating, so it stays outside
// Button.tsx's link-only contract (see that file's own comment). Falls back
// to the execCommand path on insecure contexts (LAN/Tailscale device
// testing), mirroring the crypto.randomUUID fallback in lib/agent/session.ts.
type CopyButtonProps = {
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
  onCopied?: () => void; // analytics-only hook, fired only on a real copy
};

export function CopyButton({
  value,
  label,
  copiedLabel,
  className,
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        try {
          textarea.select();
          document.execCommand("copy");
        } finally {
          document.body.removeChild(textarea);
        }
      }
      setCopied(true);
      onCopied?.();
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed (unfocused document, permission policy,
      // browser quirk) — the adjacent mailto: link still works, so fail
      // silently rather than showing a "Copied!" state that lied.
    }
  }

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : label}
        className={
          className ??
          "text-text-3 hover:text-gold inline-flex size-11 shrink-0 items-center justify-center transition-colors"
        }
      >
        {copied ? (
          <CheckIcon className="size-4" />
        ) : (
          <CopyIcon className="size-4" />
        )}
      </button>
      {/* Hint on hover (desktop enhancement); forced on after a real copy so
          touch devices, which never hover, still get the confirmation. */}
      <span
        role="status"
        className={`border-line bg-glass-solid text-text rounded-badge pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 border px-2 py-1 font-mono text-xs whitespace-nowrap transition-opacity duration-150 ${
          copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {copied ? copiedLabel : label}
      </span>
    </span>
  );
}
