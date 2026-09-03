/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      // Android App Links verification file. It has to be served from this
      // exact path, as application/json, with no redirect in front of it —
      // a 301/302 fails verification. This is an internal rewrite, so the
      // response is a 200 at the original URL.
      {
        source: '/.well-known/assetlinks.json',
        destination: '/api/well-known/assetlinks.json',
      },
    ]
  },
  images: {
    minimumCacheTTL: 2678400 * 6, // 3 months
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a0.muscache.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
        port: '',
        pathname: '/**',
      },
      // Tourkokan FTP storage
      {
        protocol: 'https',
        hostname: 'ftp.dev.tourkokan.com',
        port: '',
        pathname: '/**',
      },
      // Tourkokan backend (S3 / server storage)
      {
        protocol: 'https',
        hostname: 'probytesolution.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
