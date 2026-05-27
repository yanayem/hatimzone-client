/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  optimizePackageImports: ['react-icons'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flowbite.com',
      },
    ],
  },
};

export default nextConfig;
