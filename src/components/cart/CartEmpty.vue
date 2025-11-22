<template>
  <div class="cart-empty text-center py-16 px-4">
    <!-- Empty Cart Icon -->
    <div class="cart-empty-icon mb-6">
      <svg
        class="w-20 h-20 mx-auto text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    </div>

    <!-- Empty Message -->
    <p class="cart-empty-message text-lg text-gray-600 mb-8">
      {{ t("cart.empty") }}
    </p>

    <!-- Continue Shopping Button -->
    <a
      :href="productsUrl"
      class="cart-empty-cta inline-block bg-black text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
    >
      {{ t("cart.continueShopping") }}
    </a>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useThemeStore } from "../../stores/theme";

const { t } = useI18n();
const themeStore = useThemeStore();

// Get products URL from navigation
const productsUrl = computed(() => {
  return themeStore.navigation?.products || "/products";
});
</script>

<style scoped>
.cart-empty {
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
