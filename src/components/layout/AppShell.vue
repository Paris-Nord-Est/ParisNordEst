<template>
  <div class="app-shell">
    <Navigation />
    <main class="main-content">
      <component :is="page" v-bind="pageProps" />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Navigation from "../Navigation.vue";
import Footer from "../Footer.vue";
import { useThemeStore } from "../../stores/theme";
import { useCartStore } from "../../stores/cart";

// Props received from index.js
const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
  pageProps: {
    type: Object,
    default: () => ({}),
  },
});

// Initialize stores on mount
const themeStore = useThemeStore();
const cartStore = useCartStore();

onMounted(() => {
  // Initialize theme from window.BIGCARTEL_DATA
  themeStore.init();

  // Initialize cart count from window data
  cartStore.initFromWindow();
});
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
