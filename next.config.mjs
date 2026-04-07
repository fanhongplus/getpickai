/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/for/creator",
        destination: "/for/video-creator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
