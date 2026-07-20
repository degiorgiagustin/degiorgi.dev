import type { NextConfig } from "next";

// Dev-only: `next dev` rejects cross-origin HMR/asset requests unless the
// origin is allowlisted. Personal hostnames stay out of this public repo —
// put yours in web/.env.local (gitignored):
//   ALLOWED_DEV_ORIGIN=my-machine.my-tailnet.ts.net
// The *.ts.net wildcard stays as a generic fallback; ts.net addresses are
// only reachable from inside the tailnet anyway.
const devOrigin = process.env.ALLOWED_DEV_ORIGIN;

// Baseline security headers (spec 004 §3 follow-up from PR review). Only the
// headers that carry zero behavioral risk ship here — no CSP script-src yet,
// since a wrong allowlist would silently break hydration or Vercel Analytics
// in a way that's only visible on the real deployment. A full CSP needs to
// be authored and verified against production, not guessed at locally.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: [...(devOrigin ? [devOrigin] : []), "*.ts.net"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
