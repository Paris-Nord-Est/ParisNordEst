<template>
  <header data-bc-hook="header" class="modern-header">
    <div class="header-container">
      <div class="branding">
        <a :href="navigation.home" :title="t('nav.home')">
          <div class="store-header">
            <img
              src="/images/casquette/vectoriel/logo-horizontal-white.svg"
              alt="Casquette"
              class="store-logo"
            />
          </div>
        </a>
      </div>

      <nav class="header-nav" role="navigation" :aria-label="t('nav.home')">
        <ul>
          <li>
            <a :href="navigation.products">{{ t("nav.products") }}</a>
          </li>
          <li v-for="page in pages" :key="page.permalink">
            <a :href="page.url">
              {{ t(`pages.${page.permalink}`, page.name) }}
            </a>
          </li>
          <li v-if="navigation.lookbook">
            <a :href="navigation.lookbook">{{ t("nav.lookbook") }}</a>
          </li>
          <li v-if="navigation.contact">
            <a :href="navigation.contact">{{ t("nav.contact") }}</a>
          </li>
          <li>
            <a :href="cart.url">
              {{ t("nav.cart") }} (<span class="cart-num-items">{{
                cartCount
              }}</span
              >)
            </a>
          </li>
          <li class="language-switcher">
            <button
              :aria-label="t('language.switchTo', { lang: otherLanguage })"
              class="language-toggle"
              @click="toggleLanguage"
            >
              {{ currentLocale.toUpperCase() }}
            </button>
          </li>
        </ul>
      </nav>

      <button
        class="mobile-menu-toggle"
        :aria-label="t('nav.home')"
        @click="toggleMobileMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <nav
      class="header-nav mobile-nav"
      :class="{ active: mobileMenuOpen }"
      :aria-label="t('nav.home')"
      role="navigation"
    >
      <ul>
        <li>
          <a :href="navigation.products" @click="closeMobileMenu">{{
            t("nav.products")
          }}</a>
        </li>
        <li v-for="page in pages" :key="page.permalink">
          <a :href="page.url" @click="closeMobileMenu">
            {{ t(`pages.${page.permalink}`, page.name) }}
          </a>
        </li>
        <li v-if="navigation.lookbook">
          <a :href="navigation.lookbook" @click="closeMobileMenu">{{
            t("nav.lookbook")
          }}</a>
        </li>
        <li v-if="navigation.contact">
          <a :href="navigation.contact" @click="closeMobileMenu">{{
            t("nav.contact")
          }}</a>
        </li>
        <li>
          <a :href="cart.url" @click="closeMobileMenu">
            {{ t("nav.cart") }} (<span class="cart-num-items">{{
              cartCount
            }}</span
            >)
          </a>
        </li>
        <li class="language-switcher-mobile">
          <button class="language-toggle" @click="toggleLanguage">
            {{ otherLanguage.toUpperCase() }} -
            {{ t(`language.${otherLanguage}`) }}
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { setLanguage } from "../i18n";

const { t, locale } = useI18n();

// Get injected BigCartel data
const bigcartelData = window.BIGCARTEL_DATA || {
  pages: [],
  cart: { count: 0, url: "/cart" },
  navigation: {
    home: "/",
    products: "/products",
    lookbook: "/lookbook",
    contact: "/contact",
  },
};

const pages = ref(bigcartelData.pages);
const cart = ref(bigcartelData.cart);
const navigation = ref(bigcartelData.navigation);
const cartCount = ref(bigcartelData.cart.count);

// Mobile menu state
const mobileMenuOpen = ref(false);

// Language switching
const currentLocale = computed(() => locale.value);
const otherLanguage = computed(() => (locale.value === "fr" ? "en" : "fr"));

function toggleLanguage() {
  const newLocale = otherLanguage.value;
  setLanguage(newLocale);
  closeMobileMenu();
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}
</script>

<style scoped>
/* CSS Isolation - reset all inherited styles from BigCartel theme */
.modern-header,
.modern-header *,
.modern-header *::before,
.modern-header *::after {
  all: revert;
  box-sizing: border-box;
}

/* Modern Navigation Header */
.modern-header {
  background-color: #000 !important;
  color: #fff !important;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.header-container {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 1rem 2rem !important;
  max-width: 100% !important;
  margin: 0 auto !important;
}

.modern-header .branding {
  flex-shrink: 0;
}

.modern-header .branding a {
  text-decoration: none;
  color: #fff;
}

.modern-header .store-header {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.modern-header .store-logo {
  height: 40px;
  width: auto;
}

/* Desktop Navigation */
.modern-header .header-nav {
  flex: 1 !important;
  display: flex !important;
  justify-content: end !important;
}

.modern-header .header-nav ul {
  display: flex !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
  gap: 2rem !important;
  align-items: center !important;
}

.modern-header .header-nav li {
  margin: 0 !important;
  display: block !important;
}

.modern-header .header-nav a,
.modern-header .header-nav button {
  color: #fff !important;
  text-decoration: none !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  padding: 0.5rem 0 !important;
  position: relative !important;
  transition: opacity 0.3s ease !important;
  background: none !important;
  border: none !important;
  cursor: pointer !important;
  font-family: inherit !important;
}

.modern-header .header-nav a:hover,
.modern-header .header-nav button:hover {
  opacity: 0.7;
}

.modern-header .header-nav a::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #fff;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.modern-header .header-nav a:hover::after {
  transform: scaleX(1);
}

/* Language Switcher */
.language-switcher {
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.language-toggle {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.language-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #fff;
  transition: all 0.3s ease;
}

/* Mobile Navigation */
.modern-header .mobile-nav {
  display: none !important;
  background-color: #000 !important;
  border-top: 1px solid #333 !important;
}

.modern-header .mobile-nav ul {
  list-style: none !important;
  margin: 0 !important;
  padding: 1rem 2rem !important;
  flex-direction: column !important;
  gap: 0 !important;
}

.modern-header .mobile-nav li {
  margin: 0 !important;
  border-bottom: 1px solid #333 !important;
}

.modern-header .mobile-nav a,
.modern-header .mobile-nav button {
  display: block !important;
  color: #fff !important;
  text-decoration: none !important;
  padding: 1rem 0 !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  width: 100% !important;
  text-align: left !important;
  background: none !important;
  border: none !important;
  cursor: pointer !important;
  font-family: inherit !important;
}

.language-switcher-mobile {
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modern-header .header-nav:not(.mobile-nav) {
    display: none !important;
  }

  .mobile-menu-toggle {
    display: flex !important;
  }

  .modern-header .mobile-nav.active {
    display: block !important;
  }

  .header-container {
    padding: 1rem !important;
  }
}
</style>
