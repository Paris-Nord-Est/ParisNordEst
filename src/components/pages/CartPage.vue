<template>
  <div class="cart-page py-8 px-4 md:px-8 lg:px-16">
    <!-- Page Title -->
    <h1 class="page-title text-2xl md:text-3xl font-bold uppercase mb-8 text-center">
      {{ t("cart.title") }}
    </h1>

    <!-- Loading State -->
    <div v-if="loading && !hasItems" class="cart-loading text-center py-16">
      <div class="loader mx-auto mb-4"></div>
      <p class="text-gray-600">{{ t("cart.loading") }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="cart-error text-center py-16">
      <p class="text-red-600 mb-4">{{ t("cart.error") }}</p>
      <button
        class="text-sm underline hover:no-underline"
        @click="refreshCart"
      >
        {{ t("cart.retry") }}
      </button>
    </div>

    <!-- Empty Cart -->
    <CartEmpty v-else-if="isEmpty" />

    <!-- Cart Content -->
    <div v-else class="cart-content max-w-4xl mx-auto">
      <!-- Cart Message Banner (if configured in theme) -->
      <div
        v-if="cartMessage"
        class="cart-message bg-gray-100 p-4 mb-6 text-sm text-center"
      >
        {{ cartMessage }}
      </div>

      <!-- Cart Items List -->
      <ul class="cart-items list-none p-0 m-0">
        <CartItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          @update="onItemUpdate"
          @remove="onItemRemove"
        />
      </ul>

      <!-- Cart Summary -->
      <CartSummary />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useCartStore } from "../../stores/cart";
import { useThemeStore } from "../../stores/theme";
import CartItem from "../cart/CartItem.vue";
import CartEmpty from "../cart/CartEmpty.vue";
import CartSummary from "../cart/CartSummary.vue";

const { t } = useI18n();
const cartStore = useCartStore();
const themeStore = useThemeStore();

// Computed properties
const loading = computed(() => cartStore.loading);
const error = computed(() => cartStore.error);
const isEmpty = computed(() => cartStore.isEmpty);
const hasItems = computed(() => cartStore.items.length > 0);
const items = computed(() => cartStore.items);

// Cart message from theme settings
const cartMessage = computed(() => {
  return themeStore.theme?.cart_text || null;
});

// Refresh cart data
const refreshCart = async () => {
  await cartStore.refresh();
};

// Item update callback
const onItemUpdate = () => {
  // Cart store already handles the update
  // This callback can be used for analytics or notifications
};

// Item remove callback
const onItemRemove = () => {
  // Cart store already handles the removal
  // This callback can be used for analytics or notifications
};

// Load cart data on mount
onMounted(async () => {
  await refreshCart();
});
</script>

<style scoped>
.cart-page {
  min-height: 60vh;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
