import type { NextConfig } from "next";

// Dev-only: `next dev` rejects cross-origin HMR/asset requests unless the
// origin is allowlisted. Personal hostnames stay out of this public repo —
// put yours in web/.env.local (gitignored):
//   ALLOWED_DEV_ORIGIN=my-machine.my-tailnet.ts.net
// The *.ts.net wildcard stays as a generic fallback; ts.net addresses are
// only reachable from inside the tailnet anyway.
const devOrigin = process.env.ALLOWED_DEV_ORIGIN;

const nextConfig: NextConfig = {
  allowedDevOrigins: [...(devOrigin ? [devOrigin] : []), "*.ts.net"],
};

export default nextConfig;
