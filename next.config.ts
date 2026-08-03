import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exporta un sitio 100% estático a la carpeta `out/`, que Nginx sirve
  // directamente (root + try_files), sin proceso ni puerto — igual que el
  // resto de frontends del servidor.
  output: "export",
  // El export no puede optimizar imágenes en runtime; se sirven tal cual.
  images: { unoptimized: true },
};

export default nextConfig;
