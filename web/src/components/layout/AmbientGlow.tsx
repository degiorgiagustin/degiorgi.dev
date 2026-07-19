// Ambient warm radial glow, anchored top-center (spec 001 §3).
// Server component — static paint, no interactivity. Decorative, so aria-hidden.
export function AmbientGlow() {
  return <div aria-hidden className="ambient-glow" />;
}
