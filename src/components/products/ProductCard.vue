<template>
  <div class="product-card group">
    <a :href="product.url" class="block">
      <!-- Product Image -->
      <div class="product-image-container relative overflow-hidden bg-gray-100 mb-3">
        <img
          :src="productImage"
          :alt="product.name"
          class="product-image w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <!-- Status Badge Overlay -->
        <div
          v-if="statusBadge"
          class="status-badge absolute top-2 left-2 px-2 py-1 text-xs font-bold uppercase"
          :class="statusBadgeClass"
        >
          {{ statusBadge }}
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info text-center">
        <h3 class="product-name text-sm md:text-base font-semibold mb-1 uppercase">
          {{ product.name }}
        </h3>
        <p v-if="!hidePrice" class="product-price text-sm md:text-base">
          {{ formattedPrice }}
          <span v-if="product.price_suffix" class="price-suffix text-xs text-gray-500">
            {{ formattedSuffix }}
          </span>
        </p>
        <!-- Variant count -->
        <p
          v-if="showVariantCount && product.options && product.options.length > 1"
          class="variant-count text-xs text-gray-500 mt-1"
        >
          {{ product.options.length }} {{ t("products.variants") }}
        </p>
      </div>
    </a>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useBigCartel } from "../../composables/useBigCartel";

const { t } = useI18n();
const { formatPrice } = useBigCartel();

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  showVariantCount: {
    type: Boolean,
    default: false,
  },
  hideSoldOutPrices: {
    type: Boolean,
    default: false,
  },
  hideComingSoonPrices: {
    type: Boolean,
    default: false,
  },
});

// Compute product image URL
const productImage = computed(() => {
  if (props.product.image) {
    // Handle different image formats from API
    if (typeof props.product.image === "string") {
      return props.product.image;
    }
    return props.product.image.url || props.product.image.large || props.product.image.medium;
  }
  if (props.product.images && props.product.images.length > 0) {
    return props.product.images[0].url || props.product.images[0].large;
  }
  return "https://placehold.co/400x400/CCCCCC/666666?text=No+Image";
});

// Compute if price should be hidden
const hidePrice = computed(() => {
  if (props.product.status === "sold-out" && props.hideSoldOutPrices) {
    return true;
  }
  if (props.product.status === "coming-soon" && props.hideComingSoonPrices) {
    return true;
  }
  return false;
});

// Format price
const formattedPrice = computed(() => {
  const price = props.product.default_price || props.product.price;
  if (!price) return "";

  // BigCartel prices from API are typically in display format (not cents)
  // Check if it looks like cents (large number) or display format
  const numPrice = Number(price);
  if (numPrice > 1000) {
    // Likely in cents
    return formatPrice(numPrice);
  }
  // Already in display format
  const currency = window.BIGCARTEL_DATA?.store?.currency || "EUR";
  if (currency === "EUR") {
    return `${numPrice.toFixed(0)} €`;
  }
  return `$${numPrice.toFixed(0)}`;
});

// Format price suffix
const formattedSuffix = computed(() => {
  if (!props.product.price_suffix) return "";
  if (props.product.variable_pricing) {
    return `(${props.product.price_suffix})`;
  }
  return props.product.price_suffix;
});

// Status badge text
const statusBadge = computed(() => {
  if (props.product.status === "sold-out") {
    return t("products.soldOut");
  }
  if (props.product.status === "coming-soon") {
    return t("products.comingSoon");
  }
  if (props.product.on_sale) {
    return t("products.onSale");
  }
  return null;
});

// Status badge styling
const statusBadgeClass = computed(() => {
  if (props.product.status === "sold-out") {
    return "bg-gray-800 text-white";
  }
  if (props.product.status === "coming-soon") {
    return "bg-blue-600 text-white";
  }
  if (props.product.on_sale) {
    return "bg-green-600 text-white";
  }
  return "";
});
</script>

<style scoped>
.product-image-container {
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  overflow: hidden;
}

.product-card {
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-card:hover .product-name {
  text-decoration: underline;
}

.product-price {
  color: #333;
  font-weight: 500;
}

.product-name {
  font-size: 0.875rem;
  line-height: 1.4;
}

@media (min-width: 768px) {
  .product-name {
    font-size: 1rem;
  }
}

.status-badge {
  border-radius: 2px;
}
</style>
