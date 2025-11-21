<template>
  <section class="footer-content">
    <div class="footer-main">
      <!-- Logo/Icon -->
      <div class="footer-logo">
        <div class="logo-container">
          <img
            src="/images/casquette/vectoriel/logo-round-white.svg"
            alt="Casquette Logo"
            class="logo-img"
          />
        </div>
      </div>

      <div class="footer-content-container">
        <!-- Footer Title -->
        <h3 class="footer-title">
          {{ t("footer.title") }}
        </h3>

        <!-- Footer Description -->
        <p class="footer-description">
          {{ t("footer.description") }}
        </p>
      </div>
    </div>
    <div class="footer-links-container">
      <!-- Footer Links -->
      <nav class="footer-nav">
        <ul class="footer-nav-list">
          <li>
            <a :href="navigation.home" class="footer-link">{{
              t("footer.links.home")
            }}</a>
          </li>
          <li class="separator">-</li>
          <li>
            <a :href="navigation.products" class="footer-link">{{
              t("footer.links.products")
            }}</a>
          </li>
          <li class="separator">-</li>
          <li v-for="(page, index) in limitedPages" :key="page.permalink">
            <a :href="page.url" class="footer-link">
              {{ t(`pages.${page.permalink}`, page.name) }}
            </a>
            <span v-if="index < limitedPages.length - 1" class="separator-inline"
              >-</span
            >
          </li>
          <li v-if="navigation.contact" class="separator">-</li>
          <li v-if="navigation.contact">
            <a :href="navigation.contact" class="footer-link">{{
              t("footer.links.contact")
            }}</a>
          </li>
          <li class="separator">-</li>
          <li>
            <a :href="cart.url" class="footer-link">{{
              t("footer.links.cart")
            }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Get injected BigCartel data
const bigcartelData = window.BIGCARTEL_DATA || {
  pages: [],
  cart: { count: 0, url: "/cart" },
  navigation: { products: "/products", contact: "/contact", home: "/" },
};

const pages = ref(bigcartelData.pages);
const cart = ref(bigcartelData.cart);
const navigation = ref(bigcartelData.navigation);

// Show main pages in footer (lookbook and ou-nous-trouver)
const limitedPages = computed(() => {
  return pages.value.filter((page) =>
    ["lookbook", "ou-nous-trouver"].includes(page.permalink)
  );
});
</script>

<style scoped>
/* CSS Isolation - reset all inherited styles from BigCartel theme */
.footer-content,
.footer-content *,
.footer-content *::before,
.footer-content *::after {
  all: revert;
  box-sizing: border-box;
}

.footer-content {
  background-color: #1a1a1a !important;
  color: white !important;
  padding: 4rem 1rem;
}

.footer-main {
  max-width: 56rem;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
}

@media (min-width: 768px) {
  .footer-main {
    flex-direction: row;
  }
}

.footer-logo {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  filter: drop-shadow(0 4px 6px rgba(255, 255, 255, 0.1));
}

.logo-container {
  width: 20rem;
  height: 20rem;
}

.logo-img {
  width: 100%;
  height: 100%;
}

.footer-content-container {
  text-align: justify;
}

.footer-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-family: "Sharpie", ui-sans-serif, system-ui, sans-serif;
  color: white !important;
  text-transform: none;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .footer-title {
    font-size: 3.75rem;
  }
}

.footer-description {
  font-size: 1rem;
  line-height: 1.8;
  max-width: 48rem;
  margin: 0 auto 2.5rem;
  opacity: 0.95;
  color: white !important;
}

@media (min-width: 768px) {
  .footer-description {
    font-size: 1.125rem;
  }
}

.footer-nav ul {
  list-style: none;
}

.footer-nav a {
  text-decoration: none;
}

.footer-nav-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  color: white !important;
}

@media (min-width: 768px) {
  .footer-nav-list {
    gap: 1.5rem;
    font-size: 1rem;
  }
}

.separator {
  display: none;
}

@media (min-width: 768px) {
  .separator {
    display: inline;
  }
}

.separator-inline {
  display: none;
  margin: 0 0.5rem;
}

@media (min-width: 768px) {
  .separator-inline {
    display: inline;
  }
}

.footer-link {
  transition: opacity 0.15s ease;
  color: white !important;
}

.footer-link:hover {
  opacity: 0.7;
}
</style>
