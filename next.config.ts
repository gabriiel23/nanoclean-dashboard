import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera un servidor Node autocontenido en .next/standalone,
  // ideal para empaquetar en una imagen Docker mínima.
  output: "standalone",
};

export default nextConfig;
