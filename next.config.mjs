/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: { '/*': ['./public/reference-styles/**/*'] },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};
export default nextConfig;
