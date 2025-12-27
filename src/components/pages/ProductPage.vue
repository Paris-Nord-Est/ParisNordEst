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

          <!-- Payment Options -->
          <div class="payment-options">
            <div class="payment-option-item">
              <svg class="klarna-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1448 609" fill="none">
                <path d="M0 304.493C0 180.585 0 118.631 30.3995 74.5079C42.2947 57.2427 57.2427 42.2947 74.5079 30.3995C118.631 0 180.585 0 304.493 0H1142.75C1266.65 0 1328.61 0 1372.73 30.3995C1390 42.2947 1404.95 57.2427 1416.84 74.5079C1447.24 118.631 1447.24 180.585 1447.24 304.493C1447.24 428.402 1447.24 490.356 1416.84 534.479C1404.95 551.744 1390 566.692 1372.73 578.587C1328.61 608.987 1266.65 608.987 1142.75 608.987H304.494C180.585 608.987 118.631 608.987 74.5079 578.587C57.2427 566.692 42.2947 551.744 30.3995 534.479C0 490.356 0 428.402 0 304.493Z" fill="#FFA8CD"/>
                <path d="M1166.17 389.005C1140.92 389.005 1121.24 368.125 1121.24 342.771C1121.24 317.416 1140.92 296.536 1166.17 296.536C1191.42 296.536 1211.1 317.416 1211.1 342.771C1211.1 368.125 1191.42 389.005 1166.17 389.005ZM1153.54 437.85C1175.08 437.85 1202.56 429.647 1217.79 397.581L1219.27 398.327C1212.59 415.851 1212.59 426.292 1212.59 428.902V433.003H1266.8V252.538H1212.59V256.64C1212.59 259.25 1212.59 269.69 1219.27 287.214L1217.79 287.96C1202.56 255.894 1175.08 247.691 1153.54 247.691C1101.93 247.691 1065.54 288.706 1065.54 342.771C1065.54 396.835 1101.93 437.85 1153.54 437.85ZM971.216 247.691C946.707 247.691 927.397 256.267 911.801 287.96L910.316 287.214C917 269.69 917 259.25 917 256.64V252.538H862.784V433.003H918.485V337.923C918.485 312.942 932.968 297.281 956.362 297.281C979.757 297.281 991.268 310.704 991.268 337.55V433.003H1046.97V318.162C1046.97 277.147 1015.03 247.691 971.216 247.691ZM782.203 287.96L780.717 287.214C787.401 269.69 787.401 259.25 787.401 256.64V252.538H733.186V433.003H788.887L789.258 346.126C789.258 320.772 802.626 305.484 824.536 305.484C830.477 305.484 835.305 306.23 840.875 307.722V252.538C816.366 247.318 794.457 256.64 782.203 287.96ZM605.073 389.005C579.821 389.005 560.14 368.125 560.14 342.771C560.14 317.416 579.821 296.536 605.073 296.536C630.324 296.536 650.005 317.416 650.005 342.771C650.005 368.125 630.324 389.005 605.073 389.005ZM592.447 437.85C613.985 437.85 641.464 429.647 656.689 397.581L658.174 398.327C651.49 415.851 651.49 426.292 651.49 428.902V433.003H705.706V252.538H651.49V256.64C651.49 259.25 651.49 269.69 658.174 287.214L656.689 287.96C641.464 255.894 613.985 247.691 592.447 247.691C540.83 247.691 504.439 288.706 504.439 342.771C504.439 396.835 540.83 437.85 592.447 437.85ZM426.828 433.003H482.53V172H426.828V433.003ZM385.981 172H329.165C329.165 218.608 300.572 260.368 257.125 290.197L240.043 302.129V172H181V433.003H240.043V303.62L337.706 433.003H409.747L315.797 309.213C358.501 278.266 386.352 230.166 385.981 172Z" fill="#0B051D"/>
              </svg>
              <span class="payment-text">{{ t("product.klarnaPayment") }}</span>
            </div>
          </div>
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
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.6s ease;
}

@media (min-width: 768px) {
  .product-title {
    font-size: 2.75rem;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form */
.product-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

/* Payment Options */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.payment-option-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.klarna-logo {
  height: 28px;
  width: auto;
  flex-shrink: 0;
}

.payment-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
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
