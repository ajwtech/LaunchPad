/** @type {import('next').NextConfig} */

// Extract hostname from STORAGE_URL if it's a full URL
function getStorageHostname() {
  const storageUrl = process.env.STORAGE_URL;
  if (!storageUrl) {
    return "localhost";
  }
  
  try {
    // If it's a full URL, extract hostname
    if (storageUrl.startsWith('http://') || storageUrl.startsWith('https://')) {
      return new URL(storageUrl).hostname;
    }
    // If it's just a hostname, return as-is
    return storageUrl;
  } catch {
    return "localhost";
  }
}

const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: getStorageHostname() },
      { hostname: "localhost" }, // For local development with Azurite
    ],
  },
  pageExtensions: ["ts", "tsx"],
  async redirects() {
    let redirections = [];
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/redirections`
      );
      const result = await res.json();
      const redirectItems = result.data.map(({ source, destination }) => {
        return {
          source: `/:locale${source}`,
          destination: `/:locale${destination}`,
          permanent: false,
        };
      });

      redirections = redirections.concat(redirectItems);

      return redirections;
    } catch (error) {
      return [];
    }
  },
};

export default nextConfig;
