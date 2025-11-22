<template>
  <div class="products-page">
    <!-- Page Header with Category Navigation -->
    <section class="page-header py-8 md:py-12 px-4">
      <div class="container mx-auto">
        <h1 class="page-title text-4xl md:text-5xl font-bold uppercase tracking-wide text-center mb-6">
          {{ pageTitle }}
        </h1>

        <!-- Category Navigation -->
        <nav
          v-if="categories.length > 0 && !isSearchResults"
          class="category-nav flex flex-wrap justify-center gap-2 md:gap-4"
          aria-label="Category navigation"
        >
          <a
            href="/products"
            class="category-link px-4 py-2 text-sm uppercase font-medium transition-colors"
            :class="{ active: !activeCategory }"
          >
            {{ t("products.all") }}
          </a>
          <a
            v-for="cat in categories"
            :key="cat.permalink"
            :href="cat.url"
            class="category-link px-4 py-2 text-sm uppercase font-medium transition-colors"
            :class="{ active: activeCategory === cat.permalink }"
          >
            {{ cat.name }}
          </a>
        </nav>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <p class="mt-4 text-gray-600">{{ t("products.loading") }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-600">
      <p>{{ error }}</p>
    </div>

    <!-- Products Grid -->
    <section v-else-if="filteredProducts.length > 0" class="products-section py-8 px-4">
      <div class="container mx-auto">
        <div class="product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            :show-variant-count="showVariantCount"
            :hide-sold-out-prices="hideSoldOutPrices"
            :hide-coming-soon-prices="hideComingSoonPrices"
          />
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-600">
      <p>{{ t("products.noProducts") }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useBigCartel } from "../../composables/useBigCartel";
import { useThemeStore } from "../../stores/theme";
import ProductCard from "../products/ProductCard.vue";

const { t } = useI18n();
const { findAllProducts } = useBigCartel();
const themeStore = useThemeStore();

// Props from data-* attributes
const props = defineProps({
  category: {
    type: String,
    default: null,
  },
  search: {
    type: String,
    default: null,
  },
});

// State
const loading = ref(true);
const error = ref(null);
const products = ref([]);

// Theme options (could come from themeStore or window.themeOptions)
const showVariantCount = computed(() => window.themeOptions?.showProductVariantCountInGrid || false);
const hideSoldOutPrices = computed(() => !window.themeOptions?.showSoldOutPrices);
const hideComingSoonPrices = computed(() => !window.themeOptions?.showComingSoonProductPrices);

// Get categories from theme store or window data
const categories = computed(() => {
  return themeStore.categories || window.BIGCARTEL_DATA?.categories || [];
});

// Determine active category from URL or props
const activeCategory = computed(() => {
  if (props.category) return props.category;

  // Try to extract from current URL
  const currentPage = window.BIGCARTEL_DATA?.currentPage;
  if (currentPage?.fullUrl) {
    const match = currentPage.fullUrl.match(/\/category\/([^/?]+)/);
    if (match) return match[1];
  }
  return null;
});

// Check if this is search results
const isSearchResults = computed(() => {
  return !!props.search || window.location.search.includes("search=");
});

// Page title
const pageTitle = computed(() => {
  if (isSearchResults.value) {
    return t("products.searchResults");
  }
  if (activeCategory.value) {
    const cat = categories.value.find((c) => c.permalink === activeCategory.value);
    return cat?.name || t("products.title");
  }
  return t("products.title");
});

// Filter products by category
const filteredProducts = computed(() => {
  let result = products.value;

  // Filter by category if active
  if (activeCategory.value) {
    result = result.filter((product) => {
      // BigCartel products have a categories array
      if (product.categories) {
        return product.categories.some((cat) => cat.permalink === activeCategory.value);
      }
      // Or check category_permalink if available
      if (product.category_permalink) {
        return product.category_permalink === activeCategory.value;
      }
      return true; // Show all if no category info
    });
  }

  // Filter by search term if provided
  if (props.search) {
    const searchLower = props.search.toLowerCase();
    result = result.filter((product) => product.name.toLowerCase().includes(searchLower));
  }

  return sortProducts(result);
});

// Custom product sorting logic (from existing ProductGrid)
const sortProducts = (products) => {
  // Priority order (first category) - customize as needed
  const priorityOrder = [115392261, 102294355, 103866085, 89598492, 102007111];

  const priorityProducts = [];
  const tshirts = [];
  const otherProducts = [];

  products.forEach((product) => {
    const priorityIndex = priorityOrder.indexOf(product.id);

    if (priorityIndex !== -1) {
      priorityProducts.push({ product, priorityIndex });
    } else if (product.name.toLowerCase().includes("t-shirt")) {
      tshirts.push(product);
    } else {
      otherProducts.push(product);
    }
  });

  priorityProducts.sort((a, b) => a.priorityIndex - b.priorityIndex);

  return [...priorityProducts.map((item) => item.product), ...otherProducts, ...tshirts];
};

// Fetch products on mount
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    const fetchedProducts = await findAllProducts();

    // Map products to consistent format
    products.value = fetchedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.default_price || product.price,
      url: product.url,
      status: product.status,
      on_sale: product.on_sale,
      variable_pricing: product.variable_pricing,
      price_suffix: product.price_suffix,
      options: product.options,
      categories: product.categories,
      image:
        product.images?.[0]?.url ||
        product.image?.url ||
        "https://placehold.co/400x400/CCCCCC/666666?text=No+Image",
    }));

    // Initialize theme store if not already done
    themeStore.init();
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = t("products.error");
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.products-page {
  min-height: 60vh;
  background-color: #f5f5f0;
}

.page-header {
  background-color: #f9fafb;
}

.category-link {
  color: #666;
  border-bottom: 2px solid transparent;
}

.category-link:hover {
  color: #000;
}

.category-link.active {
  color: #000;
  border-bottom-color: #000;
  font-weight: 600;
}

.products-section {
  background-color: #f5f5f0;
}
</style>
