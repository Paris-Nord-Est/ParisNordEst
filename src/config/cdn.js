/**
 * CDN Configuration for Production Assets
 *
 * Uses jsDelivr CDN with @latest tag to automatically serve from
 * the most recent git tag. This eliminates the need to manually
 * update version numbers in the code.
 *
 * @see https://www.jsdelivr.com/features#github
 */

// Current app version - injected at build time from git tags
// These are defined by webpack.DefinePlugin
export const APP_VERSION = __APP_VERSION__;

// Build timestamp - injected at build time
export const BUILD_TIMESTAMP = __BUILD_TIMESTAMP__;

// CDN base URL for production assets
// Using @latest automatically resolves to the most recent git tag
export const CDN_BASE_URL =
  "https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@latest/source";

/**
 * Get the full CDN path for a relative asset path
 * @param {string} relativePath - Relative path to the asset (e.g., '/images/logo.svg' or 'images/logo.svg')
 * @returns {string} Full CDN URL
 *
 * @example
 * getCdnPath('/images/home/slider/hero.jpg')
 * // Returns: 'https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@latest/source/images/home/slider/hero.jpg'
 */
export function getCdnPath(relativePath) {
  // Remove leading slash if present
  const cleanPath = relativePath.startsWith("/")
    ? relativePath.slice(1)
    : relativePath;
  return `${CDN_BASE_URL}/${cleanPath}`;
}

/**
 * Alternative CDN base URLs for different scenarios
 * Uncomment and update CDN_BASE_URL if needed
 */

// Use a specific version tag (when you need a pinned version)
// export const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/Baldrani/ParisNordEst@v3.0.0/source';

// Use development localhost (for local testing)
// export const CDN_BASE_URL = 'http://localhost:9292';
