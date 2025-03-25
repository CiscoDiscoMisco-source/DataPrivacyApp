/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    // Only return rewrites if SUPABASE_URL is defined
    if (supabaseUrl) {
      return [
        {
          source: '/api/:path*',
          destination: `${supabaseUrl}/api/:path*`,
        },
      ];
    }
    
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not defined. API rewrites will not be applied.');
    return [];
  },
};

module.exports = nextConfig; 