<template>
  <div class="product-price-display" v-if="!hidePrice">
    <!-- Main Price -->
    <span class="price" :class="{ 'on-sale': onSale }">
      {{ formattedPrice }}
    </span>

    <!-- Original Price (if on sale) -->
    <span v-if="onSale && originalPrice" class="original-price">
      {{ formattedOriginalPrice }}
    </span>

    <!-- Price Suffix (e.g., "per item") -->
    <span v-if="priceSuffix" class="price-suffix">
      {{ formattedSuffix }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useBigCartel } from "../../composables/useBigCartel";

const { formatPrice } = useBigCartel();

const props = defineProps({
  price: {
    type: [Number, String],
    default: 0,
  },
  originalPrice: {
    type: [Number, String],
    default: null,
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  priceSuffix: {
    type: String,
    default: "",
  },
  variablePricing: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "active",
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

// Determine if price should be hidden
const hidePrice = computed(() => {
  if (props.status === "sold-out" && props.hideSoldOutPrices) {
    return true;
  }
  if (props.status === "coming-soon" && props.hideComingSoonPrices) {
    return true;
  }
  return false;
});

// Format price helper
const formatPriceValue = (value) => {
  if (!value) return "";
  const numValue = Number(value);

  // Check if BigCartel format (not in cents)
  const currency = window.BIGCARTEL_DATA?.store?.currency || "EUR";
  if (numValue > 1000) {
    // Likely in cents
    return formatPrice(numValue);
  }
  // Already in display format
  if (currency === "EUR") {
    return `${numValue.toFixed(0)} €`;
  }
  return `$${numValue.toFixed(0)}`;
};

// Computed formatted prices
const formattedPrice = computed(() => formatPriceValue(props.price));
const formattedOriginalPrice = computed(() => formatPriceValue(props.originalPrice));

// Formatted suffix
const formattedSuffix = computed(() => {
  if (!props.priceSuffix) return "";
  if (props.variablePricing) {
    return `(${props.priceSuffix})`;
  }
  return props.priceSuffix;
});
</script>

<style scoped>
.product-price-display {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
}

.price.on-sale {
  color: #dc2626;
}

.original-price {
  font-size: 1.125rem;
  color: #999;
  text-decoration: line-through;
}

.price-suffix {
  font-size: 0.875rem;
  color: #666;
}

@media (min-width: 768px) {
  .price {
    font-size: 1.75rem;
  }

  .original-price {
    font-size: 1.25rem;
  }
}
</style>
