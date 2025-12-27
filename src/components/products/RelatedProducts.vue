<template>
  <aside v-if="relatedProducts.length > 0" class="related-products">
    <div class="related-products-container">
      <h2 class="related-products-title">{{ t("products.relatedProducts") }}</h2>

      <div class="related-products-grid">
        <a
          v-for="product in relatedProducts"
          :key="product.id"
          :href="product.url"
          class="related-product-card"
        >
          <div class="related-product-image-container">
            <img
              v-if="product.images && product.images.length > 0"
              :src="getImageUrl(product.images[0], 'medium')"
              :alt="product.name"
              class="related-product-image"
              loading="lazy"
            />
            <div v-else class="related-product-image-placeholder">
              <svg class="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- Status Badge -->
            <span v-if="getStatusBadge(product)" class="related-product-status" :class="getStatusClass(product)">
              {{ getStatusBadge(product) }}
            </span>
          </div>

          <div class="related-product-info">
            <h3 class="related-product-name">{{ product.name }}</h3>
            <p class="related-product-price">{{ formatPrice(product.default_price) }}</p>
          </div>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useBigCartel } from "../../composables/useBigCartel";

const { t } = useI18n();
const { findAllProducts, formatPrice, getImageUrl } = useBigCartel();

const props = defineProps({
  currentProductId: {
    type: [String, Number],
    required: true,
  },
  limit: {
    type: Number,
    default: 4,
  },
});

const relatedProducts = ref([]);

// Get status badge text
const getStatusBadge = (product) => {
  if (product.status === "sold-out") {
    return t("products.soldOut");
  }
  if (product.status === "coming-soon") {
    return t("products.comingSoon");
  }
  if (product.on_sale) {
    return t("products.onSale");
  }
  return null;
};

// Get status badge class
const getStatusClass = (product) => {
  if (product.status === "sold-out") return "status-sold-out";
  if (product.status === "coming-soon") return "status-coming-soon";
  if (product.on_sale) return "status-on-sale";
  return "";
};

// Fetch related products on mount
onMounted(async () => {
  try {
    const allProducts = await findAllProducts();

    // Filter out current product and get random selection
    const otherProducts = allProducts.filter(
      (p) => p.id !== props.currentProductId && p.permalink !== props.currentProductId
    );

    // Shuffle and take limit
    const shuffled = otherProducts.sort(() => 0.5 - Math.random());
    relatedProducts.value = shuffled.slice(0, props.limit);
  } catch (err) {
    console.warn("Could not fetch related products:", err);
  }
});
</script>

<style scoped>
.related-products {
  border-top: 1px solid #eee;
  padding: 3rem 1rem;
  background-color: #fafafa;
}

.related-products-container {
  max-width: 1200px;
  margin: 0 auto;
}

.related-products-title {
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 0.05em;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .related-products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .related-products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

.related-product-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
}

.related-product-card:hover {
  transform: translateY(-4px);
}

.related-product-card:hover .related-product-name {
  text-decoration: underline;
}

.related-product-image-container {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.related-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-product-card:hover .related-product-image {
  transform: scale(1.05);
}

.related-product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  width: 3rem;
  height: 3rem;
  color: #ccc;
}

.related-product-status {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 2px;
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

.related-product-info {
  text-align: center;
}

.related-product-name {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  margin: 0 0 0.25rem;
  line-height: 1.3;
}

.related-product-price {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}
</style>
