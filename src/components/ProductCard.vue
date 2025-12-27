<template>
  <a :href="product.url" class="product-card">
    <div class="product-card-image-container">
      <img
        :src="product.image?.url || product.images?.[0]?.url"
        :alt="product.name"
        class="product-card-image"
        loading="lazy"
      />
      <div v-if="product.status !== 'active'" class="product-card-badge" :class="`badge-${product.status}`">
        {{ getStatusText(product.status) }}
      </div>
      <div v-else-if="product.on_sale" class="product-card-badge badge-sale">
        En solde
      </div>
    </div>

    <div class="product-card-info">
      <h3 class="product-card-title">{{ product.name }}</h3>
      <div class="product-card-price">
        <span v-if="product.on_sale" class="price-original">
          {{ formatPrice(product.default_price) }}
        </span>
        <span class="price-current" :class="{ 'on-sale': product.on_sale }">
          {{ formatPrice(product.on_sale ? product.min_price : product.default_price) }}
        </span>
      </div>
    </div>

    <div class="product-card-overlay">
      <span class="view-product-text">Voir le produit</span>
      <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>
  </a>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const formatPrice = (price) => {
  return window.bigcartel?.account?.moneyFormat
    ? window.bigcartel.account.moneyFormat.replace('{{amount}}', (price / 100).toFixed(2))
    : `${(price / 100).toFixed(2)} €`;
};

const getStatusText = (status) => {
  const statusMap = {
    'sold-out': 'Épuisé',
    'coming-soon': 'Bientôt',
  };
  return statusMap[status] || status;
};
</script>

<style lang="scss" scoped>
.product-card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  background: white;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);

    .product-card-image {
      transform: scale(1.05);
    }

    .product-card-overlay {
      opacity: 1;
    }
  }
}

.product-card-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f8f8f8;
  overflow: hidden;
}

.product-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(10px);

  &.badge-sale {
    background: rgba(255, 68, 68, 0.95);
    color: white;
  }

  &.badge-sold-out {
    background: rgba(0, 0, 0, 0.7);
    color: white;
  }

  &.badge-coming-soon {
    background: rgba(255, 193, 7, 0.95);
    color: #000;
  }
}

.product-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.view-product-text {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.arrow-icon {
  width: 32px;
  height: 32px;
  stroke: white;
  animation: bounceRight 1.5s ease-in-out infinite;
}

@keyframes bounceRight {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

.product-card-info {
  padding: 1rem;
}

.product-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-card-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.price-current {
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;

  &.on-sale {
    color: #ff4444;
  }
}

.price-original {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}
</style>
