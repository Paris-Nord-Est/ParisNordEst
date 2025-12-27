<template>
  <div v-if="loading" class="product-page-loader">
    <div class="loader-spinner"></div>
  </div>

  <div v-else-if="product" class="product-page">
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Accueil</a>
      <span class="separator">/</span>
      <a href="/products">Boutique</a>
      <span class="separator">/</span>
      <span class="current">{{ product.name }}</span>
    </nav>

    <div class="product-container">
      <!-- Image Gallery -->
      <div class="product-images">
        <ProductImageGallery
          :images="product.images"
          :productName="product.name"
        />
      </div>

      <!-- Product Details -->
      <div class="product-details">
        <div class="product-header">
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-price-container">
            <span v-if="product.on_sale" class="product-price-original">
              {{ formatPrice(product.default_price) }}
            </span>
            <span class="product-price">{{ formatPrice(selectedOption ? selectedOption.price : product.default_price) }}</span>
            <span v-if="product.on_sale" class="product-sale-badge">En solde</span>
          </div>
        </div>

        <!-- Product Status Badge -->
        <div v-if="product.status !== 'active'" class="product-status-badge" :class="`status-${product.status}`">
          {{ getStatusText(product.status) }}
        </div>

        <!-- Product Description -->
        <div class="product-description" v-html="formatDescription(product.description)"></div>

        <!-- Product Options -->
        <div v-if="product.options && product.options.length > 0" class="product-options">
          <div v-for="(optionGroup, index) in product.option_groups" :key="index" class="option-group">
            <label :for="`option-${index}`" class="option-label">
              {{ optionGroup.name }}
            </label>
            <select
              :id="`option-${index}`"
              v-model="selectedOptionValues[index]"
              @change="updateSelectedOption"
              class="option-select"
            >
              <option value="">Choisir {{ optionGroup.name.toLowerCase() }}</option>
              <option
                v-for="value in optionGroup.values"
                :key="value.id"
                :value="value.id"
              >
                {{ value.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Stock Indicator -->
        <div v-if="selectedOption && selectedOption.quantity < 5 && selectedOption.quantity > 0" class="stock-indicator low-stock">
          <svg class="stock-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Plus que {{ selectedOption.quantity }} en stock !
        </div>

        <!-- Add to Cart Button -->
        <div class="add-to-cart-container">
          <button
            @click="addToCart"
            :disabled="!canAddToCart"
            :class="['add-to-cart-btn', {
              'disabled': !canAddToCart,
              'adding': isAddingToCart,
              'success': showSuccess
            }]"
          >
            <span v-if="!isAddingToCart && !showSuccess">
              <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {{ getButtonText() }}
            </span>
            <span v-else-if="isAddingToCart" class="loading-spinner"></span>
            <span v-else-if="showSuccess">
              <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Ajouté !
            </span>
          </button>
        </div>

        <!-- Product Info Cards -->
        <div class="product-info-cards">
          <div class="info-card">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <div>
              <h4>Livraison rapide</h4>
              <p>Expédition sous 2-3 jours ouvrés</p>
            </div>
          </div>

          <div class="info-card">
            <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <div>
              <h4>Qualité garantie</h4>
              <p>100% coton, fabriqué à Saint-Denis</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div v-if="relatedProducts && relatedProducts.length > 0" class="related-products-section">
      <h2 class="related-products-title">Vous aimerez aussi</h2>
      <div class="related-products-grid">
        <ProductCard
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          :product="relatedProduct"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ProductImageGallery from './ProductImageGallery.vue';
import ProductCard from './ProductCard.vue';

const product = ref(null);
const loading = ref(true);
const selectedOptionValues = ref([]);
const selectedOption = ref(null);
const isAddingToCart = ref(false);
const showSuccess = ref(false);
const relatedProducts = ref([]);

// Get product permalink from data attribute
const productPermalink = ref(null);

onMounted(() => {
  // Get permalink from the app div data attribute
  const appDiv = document.getElementById('app');
  if (appDiv) {
    productPermalink.value = appDiv.getAttribute('data-product');
    fetchProduct();
  }
});

const fetchProduct = () => {
  if (!productPermalink.value) return;

  // Use BigCartel's Product API
  window.Product.find(productPermalink.value, (data) => {
    product.value = data;
    loading.value = false;

    // Initialize option values array based on option groups
    if (data.option_groups && data.option_groups.length > 0) {
      selectedOptionValues.value = new Array(data.option_groups.length).fill('');
    }

    // Fetch related products
    fetchRelatedProducts();

    // Add scroll animations
    setTimeout(() => {
      animateOnScroll();
    }, 100);
  });
};

const fetchRelatedProducts = () => {
  // Fetch all products and filter out the current one
  window.Product.findAll({}, (products) => {
    relatedProducts.value = products
      .filter(p => p.id !== product.value.id && p.status === 'active')
      .slice(0, 4);
  });
};

const formatPrice = (price) => {
  return window.bigcartel?.account?.moneyFormat
    ? window.bigcartel.account.moneyFormat.replace('{{amount}}', (price / 100).toFixed(2))
    : `${(price / 100).toFixed(2)} €`;
};

const formatDescription = (description) => {
  if (!description) return '';
  // Convert line breaks to paragraphs
  return description.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
};

const getStatusText = (status) => {
  const statusMap = {
    'sold-out': 'Épuisé',
    'coming-soon': 'Bientôt disponible'
  };
  return statusMap[status] || status;
};

const updateSelectedOption = () => {
  if (!product.value || !product.value.options) return;

  // Check if all options are selected
  const allSelected = selectedOptionValues.value.every(val => val !== '');

  if (allSelected && product.value.options) {
    // Find the matching option
    const option = product.value.options.find(opt => {
      if (!opt.option_group_values) return false;

      return opt.option_group_values.every((ogv, index) =>
        ogv.id.toString() === selectedOptionValues.value[index].toString()
      );
    });

    selectedOption.value = option || null;
  } else {
    selectedOption.value = null;
  }
};

const canAddToCart = computed(() => {
  if (!product.value) return false;
  if (product.value.status === 'sold-out') return false;

  // If product has options, ensure one is selected
  if (product.value.options && product.value.options.length > 0) {
    return selectedOption.value && !selectedOption.value.sold_out;
  }

  return true;
});

const getButtonText = () => {
  if (product.value?.status === 'sold-out') return 'Épuisé';
  if (selectedOption.value?.sold_out) return 'Épuisé';
  if (product.value?.options && product.value.options.length > 0 && !selectedOption.value) {
    return 'Sélectionner les options';
  }
  return 'Ajouter au panier';
};

const addToCart = async () => {
  if (!canAddToCart.value || isAddingToCart.value) return;

  isAddingToCart.value = true;

  const optionId = selectedOption.value ? selectedOption.value.id : product.value.options[0]?.id;

  // Use BigCartel's Cart API
  window.Cart.addItem(optionId, 1, () => {
    isAddingToCart.value = false;
    showSuccess.value = true;

    // Update cart count in navigation
    window.Cart.refresh(() => {
      // Trigger cart update event
      window.dispatchEvent(new CustomEvent('cart-updated'));
    });

    // Reset success state after 2 seconds
    setTimeout(() => {
      showSuccess.value = false;
    }, 2000);
  });
};

const animateOnScroll = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe elements
  const elements = document.querySelectorAll('.product-details, .related-products-section, .info-card');
  elements.forEach((el) => observer.observe(el));
};
</script>

<style lang="scss" scoped>
.product-page-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.loader-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.product-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.breadcrumbs {
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #666;

  a {
    color: #666;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #000;
    }
  }

  .separator {
    margin: 0 0.5rem;
  }

  .current {
    color: #000;
    font-weight: 500;
  }
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.product-images {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.product-details {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-header {
  margin-bottom: 1.5rem;
}

.product-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.product-price-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.product-price {
  font-size: 1.8rem;
  font-weight: 600;
  color: #000;
}

.product-price-original {
  font-size: 1.5rem;
  color: #999;
  text-decoration: line-through;
}

.product-sale-badge {
  background: #ff4444;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  margin-bottom: 1.5rem;

  &.status-sold-out {
    background: #f5f5f5;
    color: #666;
  }

  &.status-coming-soon {
    background: #fff3cd;
    color: #856404;
  }
}

.product-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #444;
  margin-bottom: 2rem;

  :deep(p) {
    margin: 1rem 0;
  }
}

.product-options {
  margin-bottom: 2rem;
}

.option-group {
  margin-bottom: 1.5rem;
}

.option-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.option-select {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #000;
  }

  &:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
}

.stock-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;

  &.low-stock {
    background: #fff3cd;
    color: #856404;
  }
}

.stock-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.add-to-cart-container {
  margin-bottom: 2rem;
}

.add-to-cart-btn {
  width: 100%;
  padding: 1.125rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: #000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &::before {
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

  &:hover:not(.disabled) {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active:not(.disabled) {
    transform: translateY(0);
  }

  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &.adding {
    background: #666;
  }

  &.success {
    background: #28a745;
    animation: successPulse 0.5s ease;
  }

  span {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.cart-icon,
.check-icon {
  width: 20px;
  height: 20px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes successPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.product-info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: #f8f8f8;
  border-radius: 12px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;

  &.animate-in {
    opacity: 1;
    transform: translateY(0);

    &:nth-child(2) {
      transition-delay: 0.1s;
    }
  }

  &:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
  }
}

.info-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.info-card h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.info-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.related-products-section {
  margin-top: 5rem;
  padding-top: 3rem;
  border-top: 1px solid #e0e0e0;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.related-products-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  text-align: center;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}
</style>
