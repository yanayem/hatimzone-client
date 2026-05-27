/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'standalone',
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
