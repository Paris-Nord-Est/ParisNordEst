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
        <p class="mt-4 text-gray-600">Chargement des produits...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 text-red-600">
        <p>{{ error }}</p>
      </div>

      <!-- Product Grid -->
      <div
        v-else-if="displayProducts.length > 0"
        class="product-grid grid grid-cols-2 md:grid-cols-3 gap-6"
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
                Épuisé
              </div>
              <div
                v-else-if="product.on_sale"
                class="product-status mt-1 text-xs uppercase font-bold text-green-600"
              >
                En promo
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 text-gray-600">
        <p>Aucun produit disponible pour le moment.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  limit: {
    type: Number,
    default: 6,
  },
  products: {
    type: Array,
    default: null,
  },
});

const loading = ref(false);
const error = ref(null);
const fetchedProducts = ref([]);

const displayProducts = computed(() => {
  const source = props.products || fetchedProducts.value;
  return source.slice(0, props.limit);
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
    // Check if BigCartel Product API is available
    if (window.Product && typeof window.Product.findAll === "function") {
      // BigCartel uses callback pattern: Product.findAll({}, callback)
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
      // Fallback: use placeholder products for development
      fetchedProducts.value = [
        {
          id: 1,
          name: "NOM DU PRODUIT",
          price: 37,
          url: "/product/product-1",
          status: "active",
          on_sale: false,
          image:
            "https://placehold.co/400x400/E8DED2/666666?text=Product+1",
        },
        {
          id: 2,
          name: "NOM DU PRODUIT",
          price: 37,
          url: "/product/product-2",
          status: "active",
          on_sale: false,
          image:
            "https://placehold.co/400x400/E8DED2/666666?text=Product+2",
        },
        {
          id: 3,
          name: "NOM DU PRODUIT",
          price: 37,
          url: "/product/product-3",
          status: "active",
          on_sale: false,
          image:
            "https://placehold.co/400x400/E8DED2/666666?text=Product+3",
        },
        {
          id: 4,
          name: "NOM DU PRODUIT",
          price: 37,
          url: "/product/product-4",
          status: "active",
          on_sale: false,
          image:
            "https://placehold.co/400x400/E8DED2/666666?text=Product+4",
        },
        {
          id: 5,
          name: "NOM DU PRODUIT",
          price: 37,
          url: "/product/product-5",
          status: "active",
          on_sale: false,
          image:
            "https://placehold.co/400x400/E8DED2/666666?text=Product+5",
        },
        {
          id: 6,
          name: "NOM DU PRODUIT",
          price: 37,
          url: "/product/product-6",
          status: "active",
          on_sale: false,
          image:
            "https://placehold.co/400x400/E8DED2/666666?text=Product+6",
        },
      ];
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
});
</script>

<style scoped>
.product-grid-section {
  background-color: #f5f5f0;
}

.product-image-container {
  aspect-ratio: 1 / 1;
}

.product-card:hover .product-name {
  text-decoration: underline;
}

.product-price {
  color: #333;
}
</style>
