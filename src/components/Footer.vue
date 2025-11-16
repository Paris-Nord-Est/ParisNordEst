<template>
  <section class="footer-content bg-black text-white py-16 px-4">
    <div
      class="container mx-auto max-w-4xl text-center flex flex-col md:flex-row items-center gap-16"
    >
      <!-- Logo/Icon -->
      <div class="footer-logo mb-8 flex justify-center flex-row items-center">
        <div class="logo-container w-80 h-80">
          <img
            src="/images/casquette/vectoriel/logo-round-white.svg"
            alt="Casquette Logo"
            class="w-full h-full"
          />
        </div>
      </div>

      <div class="footer-content-container text-justify">
        <!-- Footer Title -->
        <h3
          class="footer-title text-5xl md:text-6xl font-bold mb-6 font-sharpie"
        >
          {{ t("footer.title") }}
        </h3>

        <!-- Footer Description -->
        <p
          class="footer-description text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-10"
        >
          {{ t("footer.description") }}
        </p>
      </div>
    </div>
    <div class="footer-links-container">
      <!-- Footer Links -->
      <nav class="footer-nav">
        <ul
          class="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base font-medium uppercase"
        >
          <li>
            <a
              :href="navigation.home"
              class="hover:opacity-70 transition-opacity"
              >{{ t("footer.links.home") }}</a
            >
          </li>
          <li class="hidden md:inline">-</li>
          <li>
            <a
              :href="navigation.products"
              class="hover:opacity-70 transition-opacity"
              >{{ t("footer.links.products") }}</a
            >
          </li>
          <li class="hidden md:inline">-</li>
          <li v-for="(page, index) in limitedPages" :key="page.permalink">
            <a :href="page.url" class="hover:opacity-70 transition-opacity">
              {{ t(`pages.${page.permalink}`, page.name) }}
            </a>
            <span
              v-if="index < limitedPages.length - 1"
              class="hidden md:inline mx-2"
              >-</span
            >
          </li>
          <li v-if="navigation.contact" class="hidden md:inline">-</li>
          <li v-if="navigation.contact">
            <a
              :href="navigation.contact"
              class="hover:opacity-70 transition-opacity"
              >{{ t("footer.links.contact") }}</a
            >
          </li>
          <li class="hidden md:inline">-</li>
          <li>
            <a :href="cart.url" class="hover:opacity-70 transition-opacity">{{
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
.footer-content {
  background-color: #1a1a1a;
}

.footer-logo {
  filter: drop-shadow(0 4px 6px rgba(255, 255, 255, 0.1));
}

.footer-description {
  line-height: 1.8;
  opacity: 0.95;
}

.footer-nav ul {
  list-style: none;
}

.footer-nav a {
  text-decoration: none;
}
</style>
