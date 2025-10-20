<template>
  <section class="footer-content bg-black text-white py-16 px-4">
    <div class="container mx-auto max-w-4xl text-center">
      <!-- Logo/Icon -->
      <div class="footer-logo mb-8 flex justify-center">
        <div class="logo-container w-40 h-40">
          <!-- Circular logo with smiley face -->
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            class="w-full h-full"
          >
            <!-- Outer circle border -->
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke="white"
              stroke-width="3"
            />

            <!-- Smiley face -->
            <circle cx="70" cy="85" r="8" fill="white" />
            <circle cx="130" cy="85" r="8" fill="white" />
            <path
              d="M 60 120 Q 100 145 140 120"
              stroke="white"
              stroke-width="4"
              stroke-linecap="round"
              fill="none"
            />

            <!-- CASQUETTE text curved at bottom -->
            <path
              id="circlePath"
              d="M 40,140 Q 100,170 160,140"
              fill="none"
            />
            <text
              font-family="Arial, sans-serif"
              font-size="16"
              font-weight="bold"
              fill="white"
              text-anchor="middle"
            >
              <textPath href="#circlePath" startOffset="50%">
                CASQUETTE
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <!-- Footer Title -->
      <h3 class="footer-title text-3xl md:text-4xl font-bold mb-6">
        {{ t("footer.title") }}
      </h3>

      <!-- Footer Description -->
      <p
        class="footer-description text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-10"
      >
        {{ t("footer.description") }}
      </p>

      <!-- Footer Links -->
      <nav class="footer-nav">
        <ul
          class="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base font-medium"
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
          <li v-for="page in limitedPages" :key="page.permalink">
            <a :href="page.url" class="hover:opacity-70 transition-opacity">
              {{ t(`pages.${page.permalink}`, page.name) }}
            </a>
            <span v-if="!isLastPage(page)" class="hidden md:inline mx-2">-</span>
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
            <a
              :href="cart.url"
              class="hover:opacity-70 transition-opacity"
              >{{ t("footer.links.cart") }}</a
            >
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

// Show main pages in footer (lookbook, contact, etc.)
const limitedPages = computed(() => {
  return pages.value.filter(page =>
    ['lookbook', 'ou-nous-trouver'].includes(page.permalink)
  );
});

function isLastPage(page) {
  const index = limitedPages.value.findIndex(p => p.permalink === page.permalink);
  return index === limitedPages.value.length - 1;
}
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
