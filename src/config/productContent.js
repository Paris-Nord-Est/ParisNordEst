/**
 * Product-specific custom content configuration (i18n-enabled)
 *
 * Add custom content for specific products by their permalink.
 * This allows you to display special descriptions with full i18n support.
 *
 * Usage:
 * - Key: product permalink (e.g., "poulette-club")
 * - Value: Object with i18n key mapping
 */

import { createI18n } from 'vue-i18n';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

// Create a standalone i18n instance for this module
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'fr',
  fallbackLocale: 'fr',
  messages: { fr, en }
});

/**
 * Product content configuration with i18n keys
 * Maps product permalinks to their i18n content keys
 */
const productContentConfig = {
  "poulette-club": {
    i18nKey: "pouletteClub",
    hasLocation: true  // Has a map link in p3
  },
  "i-love-drama": {
    i18nKey: "iLoveDrama",
    hasLocation: false
  }
  // Add more products here as needed:
  // "autre-produit": {
  //   i18nKey: "autreProduit",
  //   hasLocation: false
  // }
};

/**
 * Generate custom HTML content from i18n translations
 * @param {string} i18nKey - The product i18n key (e.g., "pouletteClub")
 * @param {object} config - Product configuration
 * @returns {string} HTML content
 */
function generateCustomHTML(i18nKey, config) {
  const { t } = i18n.global;
  const basePath = `productDetails.${i18nKey}`;

  const title = t(`${basePath}.title`);
  const p1 = t(`${basePath}.p1`);
  const p2 = t(`${basePath}.p2`);
  const p3 = config.hasLocation ? t(`${basePath}.p3`) : null;

  return `
    <div class="custom-product-section">
      <h3>${title}</h3>
      <p>${p1}</p>
      <p>${p2}</p>
      ${p3 ? `<p><a href="https://maps.app.goo.gl/TaXqF4aHVPcvKF2K6" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">${p3}</a></p>` : ''}
    </div>
  `;
}

/**
 * Get SEO metadata from i18n
 * @param {string} i18nKey - The product i18n key
 * @returns {object} SEO metadata
 */
function getSEOData(i18nKey) {
  const { t } = i18n.global;
  const basePath = `productDetails.${i18nKey}.seo`;

  return {
    metaDescription: t(`${basePath}.metaDescription`),
    keywords: t(`${basePath}.keywords`).split(', '),
    ogTitle: t(`${basePath}.ogTitle`),
    ogDescription: t(`${basePath}.ogDescription`)
  };
}

/**
 * Get custom content for a product by its permalink
 * @param {string} permalink - The product permalink
 * @returns {object|null} Custom content object or null if none exists
 */
export function getProductCustomContent(permalink) {
  const config = productContentConfig[permalink];
  if (!config) return null;

  return {
    customDescription: generateCustomHTML(config.i18nKey, config),
    seo: getSEOData(config.i18nKey)
  };
}

/**
 * Update locale for product content
 * Call this when language changes
 * @param {string} locale - New locale (e.g., 'fr', 'en')
 */
export function setProductContentLocale(locale) {
  i18n.global.locale.value = locale;
}
