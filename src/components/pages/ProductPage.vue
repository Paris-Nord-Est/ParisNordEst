<template>
  <div class="product-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ t("product.loading") }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <a href="/products" class="back-link">{{ t("product.backToProducts") }}</a>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="product-container">
      <!-- Product Images -->
      <div class="product-images">
        <ProductGallery :images="product.images" :product-name="product.name" />
      </div>

      <!-- Product Details -->
      <div class="product-details">
        <!-- Status Badge -->
        <div v-if="statusBadge" class="product-status" :class="statusClass">
          {{ statusBadge }}
        </div>

        <!-- Title -->
        <h1 class="product-title">{{ product.name }}</h1>

        <!-- Price -->
        <ProductPrice
          :price="currentPrice"
          :original-price="product.original_price"
          :on-sale="product.on_sale"
          :price-suffix="product.price_suffix"
          :variable-pricing="product.variable_pricing"
          :status="product.status"
          :hide-sold-out-prices="hideSoldOutPrices"
          :hide-coming-soon-prices="hideComingSoonPrices"
        />

        <!-- Add to Cart Form -->
        <form
          v-if="product.status === 'active'"
          method="post"
          action="/cart"
          class="product-form"
          @submit="onSubmit"
        >
          <input type="hidden" name="utf8" value="✓" />

          <!-- Product Options -->
          <ProductOptions
            v-if="!hasDefaultOption"
            :options="product.options"
            :option-groups="product.option_groups"
            :has-default-option="hasDefaultOption"
            :show-sold-out-options="showSoldOutOptions"
            @option-change="onOptionChange"
          />

          <!-- Hidden option input for default option -->
          <input
            v-if="hasDefaultOption && product.options.length === 1"
            type="hidden"
            name="cart[add][id]"
            :value="product.options[0].id"
          />

          <!-- Add to Cart Button -->
          <AddToCart
            :disabled="!canAddToCart"
            :loading="addingToCart"
            :selected-option="selectedOption"
            :product-status="product.status"
            :show-low-inventory-messages="showLowInventoryMessages"
          />
        </form>

        <!-- Sold Out / Coming Soon Message -->
        <div v-else class="product-unavailable">
          <p class="unavailable-message">
            {{ product.status === "sold-out" ? t("products.soldOut") : t("products.comingSoon") }}
          </p>
        </div>

        <!-- Description -->
        <div v-if="product.description" class="product-description" v-html="product.description"></div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="not-found-container">
      <p>{{ t("product.notFound") }}</p>
      <a href="/products" class="back-link">{{ t("product.backToProducts") }}</a>
    </div>

    <!-- Related Products -->
    <RelatedProducts
      v-if="product && showRelatedProducts"
      :current-product-id="product.id"
      :limit="4"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useBigCartel } from "../../composables/useBigCartel";
import ProductGallery from "../products/ProductGallery.vue";
import ProductOptions from "../products/ProductOptions.vue";
import ProductPrice from "../products/ProductPrice.vue";
import AddToCart from "../products/AddToCart.vue";
import RelatedProducts from "../products/RelatedProducts.vue";

const { t } = useI18n();
const { findProduct } = useBigCartel();

// Props from data-* attributes
const props = defineProps({
  product: {
    type: String,
    required: true,
  },
});

// State
const loading = ref(true);
const error = ref(null);
const product = ref(null);
const selectedOption = ref(null);
const addingToCart = ref(false);

// Theme options
const showSoldOutOptions = computed(() => window.themeOptions?.showSoldOutOptions ?? true);
const showLowInventoryMessages = computed(() => window.themeOptions?.showLowInventoryMessages ?? false);
const hideSoldOutPrices = computed(() => !window.themeOptions?.showSoldOutPrices);
const hideComingSoonPrices = computed(() => !window.themeOptions?.showComingSoonProductPrices);
const showRelatedProducts = computed(() => window.themeOptions?.showSimilarProducts ?? true);

// Check if product has a default option (single option, no option groups)
const hasDefaultOption = computed(() => {
  if (!product.value) return false;
  return product.value.options?.length === 1 && !product.value.has_option_groups;
});

// Current price (may change with option selection)
const currentPrice = computed(() => {
  if (selectedOption.value?.price) {
    return selectedOption.value.price;
  }
  return product.value?.default_price || product.value?.price;
});

// Can add to cart
const canAddToCart = computed(() => {
  if (!product.value || product.value.status !== "active") {
    return false;
  }
  // If has default option, always can add
  if (hasDefaultOption.value) {
    return true;
  }
  // Otherwise need a selected option that's not sold out
  return selectedOption.value && !selectedOption.value.sold_out;
});

// Status badge
const statusBadge = computed(() => {
  if (!product.value) return null;
  if (product.value.status === "sold-out") {
    return t("products.soldOut");
  }
  if (product.value.status === "coming-soon") {
    return t("products.comingSoon");
  }
  if (product.value.on_sale) {
    return t("products.onSale");
  }
  return null;
});

// Status badge class
const statusClass = computed(() => {
  if (!product.value) return "";
  if (product.value.status === "sold-out") return "status-sold-out";
  if (product.value.status === "coming-soon") return "status-coming-soon";
  if (product.value.on_sale) return "status-on-sale";
  return "";
});

// Event handlers
const onOptionChange = (option) => {
  selectedOption.value = option;
};

const onSubmit = () => {
  addingToCart.value = true;
  // Form will submit normally to /cart
  // The loading state is just for UX
};

// Fetch product on mount
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    const fetchedProduct = await findProduct(props.product);
    product.value = fetchedProduct;

    // If has default option, pre-select it
    if (fetchedProduct.options?.length === 1 && !fetchedProduct.has_option_groups) {
      selectedOption.value = fetchedProduct.options[0];
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    error.value = t("product.error");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.product-page {
  min-height: 60vh;
  background-color: #fff;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error / Not Found */
.error-container,
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  gap: 1rem;
  text-align: center;
}

.back-link {
  color: #000;
  text-decoration: underline;
}

/* Product Container */
.product-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .product-container {
    grid-template-columns: 1fr 1fr;
    padding: 2rem;
    gap: 3rem;
  }
}

/* Product Images */
.product-images {
  width: 100%;
}

/* Product Details */
.product-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Status Badge */
.product-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 2px;
  align-self: flex-start;
}

.status-sold-out {
  background-color: #f3f4f6;
  color: #374151;
}

.status-coming-soon {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-on-sale {
  background-color: #dcfce7;
  color: #166534;
}

/* Title */
.product-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .product-title {
    font-size: 2.25rem;
  }
}

/* Form */
.product-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

/* Unavailable */
.product-unavailable {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: center;
}

.unavailable-message {
  font-weight: 600;
  color: #666;
  margin: 0;
}

/* Description */
.product-description {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  font-size: 1rem;
  line-height: 1.7;
  color: #333;
}

.product-description :deep(p) {
  margin-bottom: 1rem;
}

.product-description :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
