<template>
  <div class="product-gallery" :class="{ 'single-image': images.length === 1 }">
    <!-- Main Image / Carousel -->
    <div v-if="images.length > 1" class="gallery-carousel">
      <div ref="mainCarousel" class="splide main-carousel">
        <div class="splide__track">
          <ul class="splide__list">
            <li v-for="(image, index) in images" :key="index" class="splide__slide">
              <div class="image-container">
                <img
                  :src="getImageUrl(image, 'large')"
                  :alt="`${productName} - Image ${index + 1}`"
                  class="main-image"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Thumbnails -->
      <div class="thumbnails-container">
        <button
          v-if="images.length > 5"
          class="thumb-nav thumb-nav-prev"
          :disabled="currentIndex === 0"
          @click="prevSlide"
          aria-label="Previous image"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <ul class="thumbnails-list" :class="{ 'has-overflow': images.length > 5 }">
          <li
            v-for="(image, index) in images"
            :key="index"
            class="thumbnail-item"
            :class="{ active: currentIndex === index }"
          >
            <button
              class="thumbnail-button"
              @click="goToSlide(index)"
              :aria-label="`View image ${index + 1}`"
            >
              <img
                :src="getImageUrl(image, 'thumb')"
                :alt="`Thumbnail ${index + 1}`"
                loading="lazy"
              />
            </button>
          </li>
        </ul>

        <button
          v-if="images.length > 5"
          class="thumb-nav thumb-nav-next"
          :disabled="currentIndex === images.length - 1"
          @click="nextSlide"
          aria-label="Next image"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div class="mobile-nav">
        <button class="mobile-nav-btn" @click="prevSlide" aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span class="slide-counter">{{ currentIndex + 1 }} / {{ images.length }}</span>
        <button class="mobile-nav-btn" @click="nextSlide" aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Single Image -->
    <div v-else-if="images.length === 1" class="single-image-container">
      <img
        :src="getImageUrl(images[0], 'large')"
        :alt="productName"
        class="main-image"
        loading="eager"
      />
    </div>

    <!-- No Image Placeholder -->
    <div v-else class="no-image-placeholder">
      <span>{{ t("product.noImage") }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css";

const { t } = useI18n();

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  productName: {
    type: String,
    default: "Product",
  },
});

const mainCarousel = ref(null);
const currentIndex = ref(0);
let splideInstance = null;

// Get image URL with size variant
const getImageUrl = (image, size = "large") => {
  if (!image) return "https://placehold.co/600x600/CCCCCC/666666?text=No+Image";

  // Handle different image formats from BigCartel API
  if (typeof image === "string") {
    return image;
  }

  // BigCartel image object has url property
  if (image.url) {
    // BigCartel URLs can be constrained by replacing dimensions
    const baseUrl = image.url;
    if (size === "thumb") {
      return baseUrl.replace(/\/\d+\./, "/150.");
    } else if (size === "medium") {
      return baseUrl.replace(/\/\d+\./, "/600.");
    } else {
      return baseUrl.replace(/\/\d+\./, "/1000.");
    }
  }

  return image.large || image.medium || image.thumb || image.url;
};

// Navigation methods
const goToSlide = (index) => {
  if (splideInstance) {
    splideInstance.go(index);
  }
  currentIndex.value = index;
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    goToSlide(currentIndex.value - 1);
  }
};

const nextSlide = () => {
  if (currentIndex.value < props.images.length - 1) {
    goToSlide(currentIndex.value + 1);
  }
};

// Initialize Splide carousel
const initCarousel = () => {
  if (mainCarousel.value && props.images.length > 1) {
    splideInstance = new Splide(mainCarousel.value, {
      type: "slide",
      perPage: 1,
      pagination: false,
      arrows: false,
      gap: "1rem",
    });

    splideInstance.on("moved", (newIndex) => {
      currentIndex.value = newIndex;
    });

    splideInstance.mount();
  }
};

// Cleanup
const destroyCarousel = () => {
  if (splideInstance) {
    splideInstance.destroy();
    splideInstance = null;
  }
};

onMounted(() => {
  initCarousel();
});

onUnmounted(() => {
  destroyCarousel();
});

// Reinitialize if images change
watch(
  () => props.images,
  () => {
    destroyCarousel();
    setTimeout(initCarousel, 100);
  }
);
</script>

<style scoped>
.product-gallery {
  width: 100%;
}

.gallery-carousel {
  position: relative;
}

.main-carousel {
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.image-container {
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.single-image-container {
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.single-image-container .main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Thumbnails */
.thumbnails-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.thumbnails-list {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.thumbnails-list::-webkit-scrollbar {
  display: none;
}

.thumbnail-item {
  flex-shrink: 0;
}

.thumbnail-button {
  display: block;
  width: 60px;
  height: 60px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;
  transition: border-color 0.2s;
}

.thumbnail-item.active .thumbnail-button {
  border-color: #000;
}

.thumbnail-button:hover {
  border-color: #666;
}

.thumbnail-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Thumbnail Navigation */
.thumb-nav {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.thumb-nav:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #000;
}

.thumb-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.thumb-nav svg {
  width: 16px;
  height: 16px;
}

/* Mobile Navigation */
.mobile-nav {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.mobile-nav-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav-btn svg {
  width: 20px;
  height: 20px;
}

.slide-counter {
  font-size: 0.875rem;
  color: #666;
}

/* No Image */
.no-image-placeholder {
  aspect-ratio: 1 / 1;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .thumbnails-container {
    display: none;
  }

  .mobile-nav {
    display: flex;
  }

  .thumbnail-button {
    width: 50px;
    height: 50px;
  }
}
</style>
