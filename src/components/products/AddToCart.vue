<template>
  <div class="add-to-cart">
    <!-- Add to Cart Button -->
    <button
      type="submit"
      class="add-to-cart-button"
      :disabled="disabled || loading"
      :class="{ loading: loading }"
    >
      <span v-if="!loading" class="button-content">
        <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span>{{ buttonText }}</span>
      </span>
      <span v-else class="spinner"></span>
    </button>

    <!-- Inventory Message -->
    <transition name="fade">
      <div v-if="inventoryMessage" class="inventory-message" :class="inventoryClass">
        <svg class="warning-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        {{ inventoryMessage }}
      </div>
    </transition>
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
  gap: 1rem;
}

.add-to-cart-button {
  width: 100%;
  padding: 1.125rem 2rem;
  font-size: 1.05rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #fff;
  background-color: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  position: relative;
  overflow: hidden;
}

.add-to-cart-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.add-to-cart-button:hover:not(:disabled) {
  background-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.add-to-cart-button:hover:not(:disabled)::before {
  width: 300px;
  height: 300px;
}

.add-to-cart-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.add-to-cart-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.add-to-cart-button.loading {
  background-color: #666;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  position: relative;
  z-index: 1;
}

.cart-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
  animation: cartBounce 2s ease-in-out infinite;
}

@keyframes cartBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.add-to-cart-button:hover .cart-icon {
  animation: cartShake 0.5s ease;
}

@keyframes cartShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

/* Spinner */
.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
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
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.warning-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.inventory-message.low-stock {
  background-color: #fff3cd;
  color: #856404;
  border-left: 4px solid #ffc107;
}

.inventory-message.sold-out {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .add-to-cart-button {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  .cart-icon {
    width: 18px;
    height: 18px;
  }

  .inventory-message {
    font-size: 0.85rem;
    padding: 0.625rem 0.875rem;
  }
}
</style>
