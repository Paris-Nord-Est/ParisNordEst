<template>
  <section class="product-grid-section py-12 px-4">
    <div class="container mx-auto">
      <!-- Section Title -->
      <h2
        v-if="title"
        class="section-title text-center text-3xl md:text-4xl font-bold mb-8 uppercase tracking-wide"
      >
        {{ title }}
      </h2>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
        ></div>
        <p class="mt-4 text-gray-600">{{ t("productGrid.loading") }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-600">
        <p>{{ t("productGrid.error") }}</p>
      </div>

      <!-- Product Grid -->
      <div
        v-else-if="displayProducts.length > 0"
        class="product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <div
          v-for="product in displayProducts"
          :key="product.id"
          class="product-card group"
        >
          <a :href="product.url" class="block">
            <!-- Product Image -->
            <div
              class="product-image-container relative overflow-hidden bg-gray-100 mb-3"
            >
              <img
                :src="product.image"
                :alt="product.name"
                class="product-image w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <!-- Product Info -->
            <div class="product-info text-center">
              <h3
                class="product-name text-sm md:text-base font-semibold mb-1 uppercase"
              >
                {{ product.name }}
              </h3>
              <p class="product-price text-sm md:text-base">
                {{ formatPrice(product.price) }}
              </p>
              <!-- Product Status Badge -->
              <div
                v-if="product.status === 'sold-out'"
                class="product-status mt-1 text-xs uppercase font-bold text-red-600"
              >
                {{ t("productGrid.soldOut") }}
              </div>
              <div
                v-else-if="product.on_sale"
                class="product-status mt-1 text-xs uppercase font-bold text-green-600"
              >
                {{ t("productGrid.onSale") }}
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 text-gray-600">
        <p>{{ t("productGrid.empty") }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { products as fallbackProducts } from "../data/products";

const { t } = useI18n();

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  limit: {
    type: Number,
    default: 6,
  },
  desktopLimit: {
    type: Number,
    default: null,
  },
  mobileLimit: {
    type: Number,
    default: null,
  },
  products: {
    type: Array,
    default: null,
  },
  productIds: {
    type: Array,
    default: null,
  },
  excludeIds: {
    type: Array,
    default: null,
  },
});

const loading = ref(false);
const error = ref(null);
const fetchedProducts = ref([]);
const isMobile = ref(window.innerWidth < 768);

// Custom product sorting logic
const sortProducts = (products) => {
  // Priority order (first category)
  const priorityOrder = [115392261, 102294355, 103866085, 89598492, 102007111];

  // Separate products into categories
  const priorityProducts = [];
  const tshirts = [];
  const otherProducts = [];

  products.forEach(product => {
    const priorityIndex = priorityOrder.indexOf(product.id);

    if (priorityIndex !== -1) {
      // Add to priority products with their index for sorting
      priorityProducts.push({ product, priorityIndex });
    } else if (product.name.toLowerCase().includes('t-shirt')) {
      // T-shirts go to the end
      tshirts.push(product);
    } else {
      // Everything else goes in the middle
      otherProducts.push(product);
    }
  });

  // Sort priority products by their specified order
  priorityProducts.sort((a, b) => a.priorityIndex - b.priorityIndex);

  // Combine: priority products first, then others, then t-shirts
  return [
    ...priorityProducts.map(item => item.product),
    ...otherProducts,
    ...tshirts
  ];
};

const displayProducts = computed(() => {
  let source = props.products || fetchedProducts.value;

  // Filter by specific product IDs if provided
  if (props.productIds && props.productIds.length > 0) {
    source = source.filter(product => props.productIds.includes(product.id));
  }

  // Exclude specific product IDs if provided
  if (props.excludeIds && props.excludeIds.length > 0) {
    source = source.filter(product => !props.excludeIds.includes(product.id));
  }

  const sortedProducts = sortProducts(source);

  // Determine limit based on screen size
  let effectiveLimit = props.limit;
  if (props.mobileLimit && isMobile.value) {
    effectiveLimit = props.mobileLimit;
  } else if (props.desktopLimit && !isMobile.value) {
    effectiveLimit = props.desktopLimit;
  }

  return sortedProducts.slice(0, effectiveLimit);
});

const formatPrice = (price) => {
  if (!price) return "";

  // Check if window.bigcartel and currency are available
  const currency = window.bigcartel?.account?.currency || "EUR";
  const moneyFormat = window.bigcartel?.account?.moneyFormat || "{{amount}} €";

  // BigCartel prices are already in display format (not cents)
  const amount = Number(price).toFixed(0);

  // Simple formatting
  if (currency === "EUR") {
    return `${amount} €`;
  } else if (currency === "USD") {
    return `$${amount}`;
  } else {
    return moneyFormat.replace("{{amount}}", amount);
  }
};

const fetchProducts = () => {
  // If products are provided via props, don't fetch
  if (props.products) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Detect if we're in local development (Dugway)
    const isLocalDev = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';

    if (isLocalDev) {
      // Use real product data for local development (Dugway returns dummy data)
      console.log("Local development detected - using real product data");
      fetchedProducts.value = fallbackProducts;
      loading.value = false;
    } else if (window.Product && typeof window.Product.findAll === "function") {
      // Production: use BigCartel API
      console.log("Production mode - fetching from BigCartel API");
      window.Product.findAll({}, (products) => {
        console.log("BigCartel API Response:", products);

        fetchedProducts.value = products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.default_price || product.price,
          url: product.url,
          status: product.status,
          on_sale: product.on_sale,
          image:
            product.images?.[0]?.url ||
            "https://placehold.co/400x400/CCCCCC/666666?text=No+Image",
        }));

        loading.value = false;
      });
    } else {
      // Fallback: use real product data if API is not available
      console.log("BigCartel API not available - using fallback data");
      fetchedProducts.value = fallbackProducts;
      loading.value = false;
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Impossible de charger les produits.";
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();

  // Handle window resize for responsive limits
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
  };
  window.addEventListener('resize', handleResize);

  // Cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
</script>

<style scoped>
.product-grid-section {
  background-color: #f5f5f0;
}

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
</style>
