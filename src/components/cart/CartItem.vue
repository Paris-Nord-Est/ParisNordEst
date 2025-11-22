<template>
  <li class="cart-item flex gap-4 py-4 border-b border-gray-200">
    <!-- Product Image -->
    <a :href="productUrl" class="cart-item-image shrink-0">
      <img
        v-if="productImage"
        :src="productImage"
        :alt="productName"
        class="w-20 h-20 md:w-24 md:h-24 object-cover bg-gray-100"
      />
      <div
        v-else
        class="w-20 h-20 md:w-24 md:h-24 bg-gray-200 flex items-center justify-center"
      >
        <svg
          class="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </a>

    <!-- Product Details -->
    <div class="cart-item-details flex-1 flex flex-col justify-between">
      <div>
        <a
          :href="productUrl"
          class="cart-item-name font-medium text-sm md:text-base"
        >
          {{ productName }}
        </a>

        <!-- Option Name (extracted from item name if different from product name) -->
        <div
          v-if="optionName"
          class="cart-item-option text-xs md:text-sm text-gray-600 mt-1"
        >
          {{ optionName }}
        </div>

        <!-- Unit Price -->
        <div class="cart-item-unit-price text-xs text-gray-500 mt-1">
          {{ formatPrice(item.unit_price) }}
        </div>
      </div>

      <!-- Mobile Remove Button -->
      <button
        type="button"
        class="cart-item-remove-text text-xs text-gray-500 hover:text-gray-700 underline mt-2 md:hidden text-left"
        :disabled="loading"
        @click="handleRemove"
      >
        {{ t("cart.remove") }}
      </button>
    </div>

    <!-- Quantity & Price -->
    <div class="cart-item-quantity-price flex flex-col items-end gap-2">
      <!-- Quantity Input -->
      <div class="cart-item-quantity flex items-center gap-1">
        <button
          type="button"
          class="quantity-btn w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          :disabled="loading || item.quantity <= 1"
          @click="updateQuantity(item.quantity - 1)"
        >
          -
        </button>
        <input
          type="number"
          :value="item.quantity"
          min="1"
          class="quantity-input w-12 h-8 text-center border border-gray-300 text-sm"
          :disabled="loading"
          @change="handleQuantityChange"
        />
        <button
          type="button"
          class="quantity-btn w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          :disabled="loading"
          @click="updateQuantity(item.quantity + 1)"
        >
          +
        </button>
      </div>

      <!-- Line Item Price -->
      <div class="cart-item-price font-medium text-sm md:text-base">
        {{ formatPrice(item.price) }}
      </div>

      <!-- Desktop Remove Button -->
      <button
        type="button"
        class="cart-item-remove hidden md:flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600"
        :title="t('cart.remove')"
        :disabled="loading"
        @click="handleRemove"
      >
        <svg
          class="w-4 h-4"
          aria-hidden="true"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          <path
            d="M437.5 386.6L306.9 256l130.6-130.6c14.1-14.1 14.1-36.8 0-50.9-14.1-14.1-36.8-14.1-50.9 0L256 205.1 125.4 74.5c-14.1-14.1-36.8-14.1-50.9 0-14.1 14.1-14.1 36.8 0 50.9L205.1 256 74.5 386.6c-14.1 14.1-14.1 36.8 0 50.9 14.1 14.1 36.8 14.1 50.9 0L256 306.9l130.6 130.6c14.1 14.1 36.8 14.1 50.9 0 14-14.1 14-36.9 0-50.9z"
          />
        </svg>
      </button>
    </div>
  </li>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useBigCartel } from "../../composables/useBigCartel";
import { useCartStore } from "../../stores/cart";

const { t } = useI18n();
const { formatPrice, findProduct } = useBigCartel();
const cartStore = useCartStore();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update", "remove"]);

// Product data fetched from API (for image)
const productData = ref(null);

const loading = computed(() => cartStore.loading);

// BigCartel Cart API structure:
// item.name = "Product Name - Option Name" (combined)
// item.product = "product-permalink" (string, not object)
// item.option = 123456 (option ID, not object)

// Extract product name from item.name (before the " - " separator if present)
const productName = computed(() => {
  // The item.name contains the full name like "T-SHIRT PARISN NORD-EST - BLANC - LARGE"
  // We want to show just the product name part
  const name = props.item.name || "";
  // Try to extract base product name (everything before first " - ")
  const parts = name.split(" - ");
  return parts[0] || name;
});

// Extract option name (everything after the product name)
const optionName = computed(() => {
  const name = props.item.name || "";
  const parts = name.split(" - ");
  if (parts.length > 1) {
    // Join remaining parts as option name
    return parts.slice(1).join(" - ");
  }
  return null;
});

// Product URL using permalink
const productUrl = computed(() => {
  // item.product is the permalink string
  const permalink =
    typeof props.item.product === "string"
      ? props.item.product
      : props.item.product?.url || `/product/${props.item.product}`;
  return `/product/${permalink}`;
});

// Product image from fetched product data
const productImage = computed(() => {
  if (productData.value?.images?.[0]) {
    const img = productData.value.images[0];
    return img.medium || img.thumb || img.url;
  }
  return null;
});

// Fetch product data for image on mount
onMounted(async () => {
  try {
    const permalink =
      typeof props.item.product === "string"
        ? props.item.product
        : props.item.product?.permalink;
    if (permalink) {
      productData.value = await findProduct(permalink);
    }
  } catch (err) {
    console.warn("Could not fetch product data for cart item:", err);
  }
});

// Update quantity
const updateQuantity = async (newQuantity) => {
  if (newQuantity < 1) return;
  await cartStore.updateItem(props.item.id, newQuantity);
  emit("update");
};

// Handle manual quantity input
const handleQuantityChange = async (event) => {
  const newQuantity = parseInt(event.target.value, 10);
  if (newQuantity >= 1) {
    await updateQuantity(newQuantity);
  } else {
    // Reset to current value if invalid
    event.target.value = props.item.quantity;
  }
};

// Remove item
const handleRemove = async () => {
  await cartStore.removeItem(props.item.id);
  emit("remove");
};
</script>

<style scoped>
.cart-item {
  transition: opacity 0.2s ease;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input {
  -moz-appearance: textfield;
}
</style>
