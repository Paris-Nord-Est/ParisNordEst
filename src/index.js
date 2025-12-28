/**
 * Paris Nord-Est - Vue Application Entry Point
 *
 * This is the main entry point for the Vue-first architecture.
 * It detects the current page type from data-page attribute and mounts
 * the appropriate page component within the AppShell layout.
 *
 * Architecture:
 * - Single #app mount point with data-page attribute
 * - AppShell wraps all pages (Navigation + Content + Footer)
 * - Page components receive props from data-* attributes
 * - Pinia stores for global state (cart, theme)
 */

import { createApp } from "vue";
import { createPinia } from "pinia";
import * as Sentry from "@sentry/vue";
import i18n from "./i18n";
import { sentryConfig } from "./config/sentry";
import { APP_VERSION, BUILD_TIMESTAMP } from "./config/cdn";

// Styles - loaded for all Vue pages
import "./style.css";

// Log version info on app load
console.log(
  `%c🧢 Paris Nord-Est %c${APP_VERSION}`,
  "color: #fff; background: #000; padding: 4px 8px; border-radius: 3px; font-weight: bold;",
  "color: #4ade80; background: #052e16; padding: 4px 8px; border-radius: 3px; font-weight: bold;"
);
console.log(`📦 Build: ${BUILD_TIMESTAMP}`);
console.log(`🌐 CDN: @latest → ${APP_VERSION}`);

// Make version available globally for easy checking
window.PNE_VERSION = APP_VERSION;
window.PNE_BUILD = BUILD_TIMESTAMP;

let sentryInitialized = false;

/**
 * Initialize Sentry error tracking with Vue app
 */
function initSentry(app) {
  if (sentryConfig.dsn && !sentryInitialized && app) {
    Sentry.init({
      app,
      dsn: sentryConfig.dsn,
      environment: sentryConfig.environment,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: sentryConfig.tracesSampleRate,
      replaysSessionSampleRate: sentryConfig.replaysSessionSampleRate,
      replaysOnErrorSampleRate: sentryConfig.replaysOnErrorSampleRate,
    });
    sentryInitialized = true;
    console.log("[PNE] Sentry initialized");
  }
}

// Layout
import AppShell from "./components/layout/AppShell.vue";

// Page Components
import HomePage from "./components/pages/HomePage.vue";
import ProductsPage from "./components/pages/ProductsPage.vue";
import ProductPage from "./components/pages/ProductPage.vue";
import CartPage from "./components/pages/CartPage.vue";
import ContactPage from "./components/pages/ContactPage.vue";
import LookbookPage from "./components/pages/LookbookPage.vue";
import FAQPage from "./components/pages/FAQPage.vue";
import CGVPage from "./components/pages/CGVPage.vue";
import CustomPage from "./components/pages/CustomPage.vue";

// Legacy components (for backward compatibility during migration)
import Navigation from "./components/Navigation.vue";
import Footer from "./components/Footer.vue";

// Page component registry
const pageComponents = {
  home: HomePage,
  products: ProductsPage,
  product: ProductPage,
  cart: CartPage,
  contact: ContactPage,
  lookbook: LookbookPage,
  faq: FAQPage,
  cgv: CGVPage,
  custom: CustomPage,
};

/**
 * Remove preloader classes from body
 */
function removePreloader() {
  document.body.classList.remove("preloader");
  setTimeout(() => {
    document.body.classList.remove("transition-preloader");
  }, 100);
}

/**
 * Extract props from data-* attributes on element
 * Converts data-product-id to productId, etc.
 */
function extractDataProps(element) {
  const props = {};
  if (!element || !element.dataset) return props;

  // Get all data attributes except 'page'
  Object.keys(element.dataset).forEach((key) => {
    if (key !== "page") {
      props[key] = element.dataset[key];
    }
  });

  return props;
}

/**
 * Mount the main Vue application
 */
function mountApp() {
  const appElement = document.getElementById("app");

  if (appElement) {
    const pageName = appElement.dataset.page;
    const PageComponent = pageComponents[pageName];

    if (PageComponent) {
      // Create the app with AppShell as root
      const app = createApp(AppShell, {
        page: PageComponent,
        pageProps: extractDataProps(appElement),
      });

      // Use plugins
      app.use(createPinia());
      app.use(i18n);

      // Initialize Sentry with this app
      initSentry(app);

      // Mount the app
      app.mount("#app");
      removePreloader();

      console.log(`[PNE] Mounted Vue app for page: ${pageName}`);
      return true;
    }
  }

  return false;
}

/**
 * Legacy mounting for pages not yet migrated to new architecture
 * This handles the old mount points during the transition period
 */
function mountLegacyApps() {
  let mounted = false;

  // Legacy: Homepage (old mount point)
  const homepageEl = document.getElementById("homepage-app");
  if (homepageEl) {
    const Homepage = require("./components/Homepage.vue").default;
    const app = createApp(Homepage);
    app.use(createPinia());
    app.use(i18n);
    initSentry(app);
    app.mount("#homepage-app");
    mounted = true;
    console.log("[PNE] Legacy mount: homepage-app");
  }

  // Legacy: Lookbook (old mount point)
  const lookbookEl = document.getElementById("lookbook");
  if (lookbookEl) {
    const { h } = require("vue");
    const Layout = require("./components/Layout.vue").default;
    const LookBook = require("./components/LookBook.vue").default;
    const app = createApp({
      render: () => h(Layout, {}, () => h(LookBook)),
    });
    app.use(createPinia());
    app.use(i18n);
    initSentry(app);
    app.mount("#lookbook");
    lookbookEl.style.position = "relative";
    mounted = true;
    console.log("[PNE] Legacy mount: lookbook");
  }

  // Legacy: Products listing (old mount point)
  const productsEl = document.getElementById("products-app");
  if (productsEl) {
    const ProductsListing = require("./components/ProductsListing.vue").default;
    const app = createApp(ProductsListing);
    app.use(createPinia());
    app.use(i18n);
    initSentry(app);
    app.mount("#products-app");
    mounted = true;
    console.log("[PNE] Legacy mount: products-app");
  }

  // Legacy: Standalone Navigation
  const navEl = document.getElementById("navigation-app");
  if (navEl && !lookbookEl) {
    const app = createApp(Navigation);
    app.use(createPinia());
    app.use(i18n);
    initSentry(app);
    app.mount("#navigation-app");
    console.log("[PNE] Legacy mount: navigation-app");
  }

  // Legacy: Standalone Footer
  const footerEl = document.getElementById("footer-app");
  if (footerEl && !lookbookEl) {
    const app = createApp(Footer);
    app.use(createPinia());
    app.use(i18n);
    initSentry(app);
    app.mount("#footer-app");
    console.log("[PNE] Legacy mount: footer-app");
  }

  return mounted;
}

/**
 * Initialize the application
 */
function init() {
  // Try new architecture first
  const newArchMounted = mountApp();

  // Fall back to legacy mounting if new arch didn't mount
  if (!newArchMounted) {
    const legacyMounted = mountLegacyApps();

    // If nothing mounted, just remove preloader
    if (!legacyMounted) {
      removePreloader();
    }
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
