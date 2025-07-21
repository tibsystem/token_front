import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
  	unoptimized: true,
  	dangerouslyAllowSVG: true,
    domains: ['placehold.co', 'img.youtube.com'], // Add the domain you're using here
  },
  // Garantir que todas as rotas sejam exportadas corretamente
  generateBuildId: () => 'build',
};

export default nextConfig;
