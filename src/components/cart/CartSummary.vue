<template>
  <div class="cart-summary border-t border-gray-200 pt-6">
    <!-- Subtotal -->
    <div class="cart-totals mb-6">
      <div
        class="cart-subtotal flex justify-between items-center text-lg font-medium"
      >
        <span>{{ t("cart.subtotal") }}</span>
        <span class="cart-subtotal-amount">{{ formattedSubtotal }}</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="cart-actions flex flex-col gap-3">
      <!-- Checkout Button (HTML Form) -->
      <form method="post" action="/cart" class="checkout-form">
        <input type="hidden" name="cart_submit" value="true" />
        <button
          type="submit"
          name="checkout"
          class="checkout-btn w-full bg-black text-white py-4 text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
          :disabled="loading"
        >
          {{ t("cart.checkout") }}
        </button>
      </form>

      <!-- Share Cart Link -->
      <button
        v-if="shareableLink"
        type="button"
        class="share-cart-btn w-full border border-gray-300 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
        @click="copyShareLink"
      >
        {{ copied ? t("cart.linkCopied") : t("cart.shareCart") }}
      </button>

      <!-- Continue Shopping -->
      <a
        :href="productsUrl"
        class="continue-shopping-link text-center text-sm text-gray-600 hover:text-gray-900 underline py-2"
      >
        {{ t("cart.continueShopping") }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useCartStore } from "../../stores/cart";
import { useThemeStore } from "../../stores/theme";

const { t } = useI18n();
const cartStore = useCartStore();
const themeStore = useThemeStore();

const copied = ref(false);

const loading = computed(() => cartStore.loading);
const formattedSubtotal = computed(() => cartStore.formattedSubtotal);
const shareableLink = computed(() => cartStore.shareableLink);

// Get products URL from navigation
const productsUrl = computed(() => {
  return themeStore.navigation?.products || "/products";
});

// Copy share link to clipboard
const copyShareLink = async () => {
  if (!shareableLink.value) return;

  try {
    await navigator.clipboard.writeText(shareableLink.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy link:", err);
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = shareableLink.value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};
</script>

<style scoped>
.checkout-form {
  width: 100%;
}
</style>
