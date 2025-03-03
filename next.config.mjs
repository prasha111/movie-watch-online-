/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
              protocol: 'https',
              hostname: '"m.media-amazon.com',
              port: '',
            }
            // Add more patterns as needed
          ],
    }
};

export default nextConfig;
