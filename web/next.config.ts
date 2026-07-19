import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: lets `next dev` accept cross-origin HMR/asset requests when the
  // server is reached over a tailnet hostname (remote/mobile device testing).
  // Wildcard on purpose — ts.net addresses are only reachable from inside the
  // tailnet, and specific hostnames don't belong in a public repo.
  allowedDevOrigins: ["*.ts.net"],
};

export default nextConfig;
