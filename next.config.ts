// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // HTTP
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/game-images/**',
      },
      // HTTPS
      {
        protocol: 'https',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/game-images/**',
      },
      // если видеоролики тоже HTTPS
      {
        protocol: 'https',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/game-videos/**',
      },
      // и HTTP для видео, если нужно
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/game-videos/**',
      },
    ],
  },
};

module.exports = nextConfig;