/**
 * Composable for managing SEO metadata
 * Injects meta tags into the document head
 */

import { onMounted, onUnmounted } from 'vue';

export function useSEO() {
  const createdElements = [];

  /**
   * Set or update a meta tag
   */
  const setMetaTag = (name, content, isProperty = false) => {
    if (!content) return;

    const attribute = isProperty ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
      createdElements.push(meta);
    }

    meta.setAttribute('content', content);
  };

  /**
   * Update page title
   */
  const setTitle = (title) => {
    if (title) {
      document.title = title;
    }
  };

  /**
   * Set product SEO metadata from custom content
   */
  const setProductSEO = (productName, customContent) => {
    if (!customContent?.seo) return;

    const { seo } = customContent;

    // Meta description
    if (seo.metaDescription) {
      setMetaTag('description', seo.metaDescription);
    }

    // Keywords
    if (seo.keywords && seo.keywords.length > 0) {
      setMetaTag('keywords', seo.keywords.join(', '));
    }

    // Open Graph
    if (seo.ogTitle) {
      setMetaTag('og:title', seo.ogTitle, true);
    }

    if (seo.ogDescription) {
      setMetaTag('og:description', seo.ogDescription, true);
    }

    // Twitter Card
    if (seo.ogTitle) {
      setMetaTag('twitter:title', seo.ogTitle);
    }

    if (seo.ogDescription) {
      setMetaTag('twitter:description', seo.ogDescription);
    }
  };

  /**
   * Cleanup function to restore original meta tags
   */
  const cleanup = () => {
    createdElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    createdElements.length = 0;
  };

  // Cleanup on component unmount
  onUnmounted(() => {
    cleanup();
  });

  return {
    setTitle,
    setMetaTag,
    setProductSEO,
    cleanup
  };
}
