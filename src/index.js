import { createApp, h } from "vue";
import i18n from "./i18n";

import App from "./App.vue";
import LookBook from "./components/LookBook.vue";
import Homepage from "./components/Homepage.vue";
import ProductsListing from "./components/ProductsListing.vue";
import Layout from "./components/Layout.vue";
import Navigation from "./components/Navigation.vue";
import Footer from "./components/Footer.vue";

// Determine if this is a Vue-powered page (needs Tailwind CSS)
const isVuePage =
  document.getElementById("homepage-app") ||
  document.getElementById("lookbook") ||
  document.getElementById("products-app");

// Only load Tailwind CSS on Vue-powered pages to avoid polluting theme pages
if (isVuePage) {
  import("./style.css");
}

// Remove preloader once DOM is ready
function removePreloader() {
  document.body.classList.remove("preloader");
  console.log("removePreloader");
  // Remove transition blocker after a short delay to allow initial render
  setTimeout(() => {
    document.body.classList.remove("transition-preloader");
  }, 100);
}

// Homepage Vue App (without Layout - Navigation/Footer mounted separately)
if (document.getElementById("homepage-app")) {
  const homepageApp = createApp(Homepage);
  homepageApp.use(i18n);
  homepageApp.mount("#homepage-app");
  removePreloader();
}

// Product Data Vue part (for product pages)
if (document.getElementById("vue")) {
  const app = createApp(App);
  app.use(i18n);
  app.mount("#vue");
  removePreloader();
}

// Products Listing Vue App (for /products page)
if (document.getElementById("products-app")) {
  const productsApp = createApp(ProductsListing);
  productsApp.use(i18n);
  productsApp.mount("#products-app");
  removePreloader();
}

// Navigation for pages that don't have Layout (homepage, product pages, etc.)
if (
  document.getElementById("navigation-app") &&
  !document.getElementById("lookbook")
) {
  const navApp = createApp(Navigation);
  navApp.use(i18n);
  navApp.mount("#navigation-app");
}

// Footer for pages that don't have Layout (homepage, product pages, etc.)
if (
  document.getElementById("footer-app") &&
  !document.getElementById("lookbook")
) {
  const footerApp = createApp(Footer);
  footerApp.use(i18n);
  footerApp.mount("#footer-app");
}

// Page Lookbook with Layout
if (document.getElementById("lookbook")) {
  const lookbookApp = createApp({
    render: () => h(Layout, {}, () => h(LookBook)),
  });
  lookbookApp.use(i18n);
  lookbookApp.mount("#lookbook");
  document.getElementById("lookbook").style.position = "relative";
  removePreloader();
}

// If no Vue app is mounted (other pages), still remove the preloader
window.addEventListener("DOMContentLoaded", () => {
  if (
    !document.getElementById("homepage-app") &&
    !document.getElementById("vue") &&
    !document.getElementById("products-app") &&
    !document.getElementById("lookbook")
  ) {
    removePreloader();
  }
});
// End Vue Part
