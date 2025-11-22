<template>
  <div class="add-to-cart">
    <!-- Add to Cart Button -->
    <button
      type="submit"
      class="add-to-cart-button"
      :disabled="disabled || loading"
      :class="{ loading: loading }"
    >
      <span v-if="loading" class="spinner"></span>
      <span v-else>{{ buttonText }}</span>
    </button>

    <!-- Inventory Message -->
    <div v-if="inventoryMessage" class="inventory-message" :class="inventoryClass">
      {{ inventoryMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  selectedOption: {
    type: Object,
    default: null,
  },
  productStatus: {
    type: String,
    default: "active",
  },
  showLowInventoryMessages: {
    type: Boolean,
    default: false,
  },
  lowInventoryThreshold: {
    type: Number,
    default: 5,
  },
});

// Button text based on state
const buttonText = computed(() => {
  if (props.productStatus === "sold-out") {
    return t("products.soldOut");
  }
  if (props.productStatus === "coming-soon") {
    return t("products.comingSoon");
  }
  if (props.selectedOption?.sold_out) {
    return t("products.soldOut");
  }
  return t("product.addToCart");
});

// Inventory message
const inventoryMessage = computed(() => {
  if (!props.showLowInventoryMessages || !props.selectedOption) {
    return null;
  }

  const quantity = props.selectedOption.quantity;
  if (quantity === undefined || quantity === null) {
    return null;
  }

  if (quantity === 0) {
    return t("products.soldOut");
  }

  if (quantity <= props.lowInventoryThreshold) {
    return t("product.lowInventory", { count: quantity });
  }

  return null;
});

// Inventory message styling
const inventoryClass = computed(() => {
  if (!props.selectedOption) return "";
  const quantity = props.selectedOption.quantity;
  if (quantity === 0) return "sold-out";
  if (quantity <= props.lowInventoryThreshold) return "low-stock";
  return "";
});
</script>

<style scoped>
.add-to-cart {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.add-to-cart-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  background-color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
}

.add-to-cart-button:hover:not(:disabled) {
  background-color: #333;
}

.add-to-cart-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.add-to-cart-button.loading {
  background-color: #666;
}

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Inventory Message */
.inventory-message {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  text-align: center;
}

.inventory-message.low-stock {
  background-color: #fff3cd;
  color: #856404;
}

.inventory-message.sold-out {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
