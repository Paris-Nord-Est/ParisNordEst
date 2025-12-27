<template>
  <div class="product-gallery" :class="{ 'single-image': images.length === 1 }">
    <!-- Main Image / Carousel -->
    <div v-if="images.length > 1" class="gallery-carousel">
      <div
        ref="mainCarousel"
        class="splide main-carousel"
        @mouseenter="zoomEnabled = true"
        @mouseleave="zoomEnabled = false"
        @mousemove="handleMouseMove"
        @click="openLightbox"
      >
        <div class="splide__track">
          <ul class="splide__list">
            <li
              v-for="(image, index) in images"
              :key="index"
              class="splide__slide"
            >
              <div class="image-container">
                <img
                  :src="getImageUrl(image, 'large')"
                  :alt="`${productName} - Image ${index + 1}`"
                  class="main-image"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  :style="
                    zoomEnabled && currentIndex === index ? zoomStyle : {}
                  "
                />
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Zoom Indicator -->
      <transition name="zoom-fade">
        <div v-if="zoomEnabled" class="zoom-indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <span>Cliquer pour agrandir</span>
        </div>
      </transition>

      <!-- Thumbnails -->
      <div class="thumbnails-container">
        <button
          v-if="images.length > 5"
          class="thumb-nav thumb-nav-prev"
          :disabled="currentIndex === 0"
          aria-label="Previous image"
          @click="prevSlide"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <ul
          class="thumbnails-list"
          :class="{ 'has-overflow': images.length > 5 }"
        >
          <li
            v-for="(image, index) in images"
            :key="index"
            class="thumbnail-item"
            :class="{ active: currentIndex === index }"
          >
            <button
              class="thumbnail-button"
              :aria-label="`View image ${index + 1}`"
              @click="goToSlide(index)"
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
          aria-label="Next image"
          @click="nextSlide"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div class="mobile-nav">
        <button
          class="mobile-nav-btn"
          aria-label="Previous"
          @click.stop="prevSlide"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span class="slide-counter"
          >{{ currentIndex + 1 }} / {{ images.length }}</span
        >
        <button
          class="mobile-nav-btn"
          aria-label="Next"
          @click.stop="nextSlide"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Single Image -->
    <div
      v-else-if="images.length === 1"
      class="single-image-container"
      @mouseenter="zoomEnabled = true"
      @mouseleave="zoomEnabled = false"
      @mousemove="handleMouseMove"
      @click="openLightbox"
    >
      <img
        :src="getImageUrl(images[0], 'large')"
        :alt="productName"
        class="main-image"
        loading="eager"
        :style="zoomEnabled ? zoomStyle : {}"
      />
      <transition name="zoom-fade">
        <div v-if="zoomEnabled" class="zoom-indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <span>Cliquer pour agrandir</span>
        </div>
      </transition>
    </div>

    <!-- No Image Placeholder -->
    <div v-else class="no-image-placeholder">
      <span>{{ t("product.noImage") }}</span>
    </div>

    <!-- Lightbox -->
    <transition name="lightbox-fade">
      <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
        <button
          class="lightbox-close"
          aria-label="Fermer"
          @click.stop="closeLightbox"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <button
          v-if="images.length > 1"
          class="lightbox-arrow lightbox-arrow-left"
          @click.stop="prevImage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <img
          :src="getImageUrl(images[lightboxIndex], 'large')"
          :alt="`${productName} - Image ${lightboxIndex + 1}`"
          class="lightbox-image"
          @click.stop
        />

        <button
          v-if="images.length > 1"
          class="lightbox-arrow lightbox-arrow-right"
          @click.stop="nextImage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div class="lightbox-counter">
          {{ lightboxIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
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
const zoomEnabled = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
let splideInstance = null;

const zoomStyle = computed(() => {
  if (!zoomEnabled.value) return {};
  return {
    transform: `scale(1.5)`,
    transformOrigin: `${mouseX.value}% ${mouseY.value}%`,
    cursor: "zoom-in",
  };
});

const handleMouseMove = (event) => {
  if (!zoomEnabled.value) return;
  const rect = event.currentTarget.getBoundingClientRect();
  mouseX.value = ((event.clientX - rect.left) / rect.width) * 100;
  mouseY.value = ((event.clientY - rect.top) / rect.height) * 100;
};

const openLightbox = () => {
  lightboxIndex.value = currentIndex.value;
  lightboxOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = "";
};

const nextImage = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % props.images.length;
};

const prevImage = () => {
  lightboxIndex.value =
    lightboxIndex.value === 0
      ? props.images.length - 1
      : lightboxIndex.value - 1;
};

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

// Keyboard navigation for lightbox
const handleKeyDown = (event) => {
  if (!lightboxOpen.value) return;

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    prevImage();
  } else if (event.key === "ArrowRight") {
    nextImage();
  }
};

onMounted(() => {
  initCarousel();
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  destroyCarousel();
  window.removeEventListener("keydown", handleKeyDown);
  document.body.style.overflow = "";
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
  border-radius: 12px;
  overflow: hidden;
  background: #f8f8f8;
  cursor: pointer;
  position: relative;
}

.image-container {
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.single-image-container {
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f8f8;
  cursor: pointer;
  position: relative;
}

.single-image-container .main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zoom-indicator {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  pointer-events: none;
  backdrop-filter: blur(10px);
  animation: pulse 2s ease-in-out infinite;
}

.zoom-indicator svg {
  width: 20px;
  height: 20px;
  stroke: white;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.zoom-fade-enter-from,
.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Thumbnails */
.thumbnails-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.thumbnails-list {
  display: flex;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
  padding-top: 0.5rem;
}

.thumbnails-list::-webkit-scrollbar {
  height: 6px;
}

.thumbnails-list::-webkit-scrollbar-track {
  background: transparent;
}

.thumbnails-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.thumbnails-list::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.thumbnail-item {
  flex-shrink: 0;
}

.thumbnail-button {
  display: block;
  width: 80px;
  height: 80px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #f8f8f8;
  transition: all 0.2s ease;
}

.thumbnail-item.active .thumbnail-button {
  border-color: #000;
}

.thumbnail-button:hover {
  border-color: #999;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Thumbnail Navigation */
.thumb-nav {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
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
  background: #000;
  border-color: #000;
}

.thumb-nav:hover:not(:disabled) svg {
  stroke: white;
}

.thumb-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.thumb-nav svg {
  width: 18px;
  height: 18px;
}

/* Mobile Navigation */
.mobile-nav {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.mobile-nav-btn {
  width: 45px;
  height: 45px;
  border: 2px solid #ddd;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.mobile-nav-btn:hover {
  background: #000;
  border-color: #000;
}

.mobile-nav-btn:hover svg {
  stroke: white;
}

.mobile-nav-btn svg {
  width: 22px;
  height: 22px;
}

.slide-counter {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10001;
}

.lightbox-close svg {
  width: 28px;
  height: 28px;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.lightbox-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.lightbox-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10001;
}

.lightbox-arrow svg {
  width: 32px;
  height: 32px;
}

.lightbox-arrow:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-arrow-left {
  left: 2rem;
}

.lightbox-arrow-right {
  right: 2rem;
}

.lightbox-counter {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  backdrop-filter: blur(10px);
}

/* No Image */
.no-image-placeholder {
  aspect-ratio: 1 / 1;
  background: #f8f8f8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1rem;
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
    width: 60px;
    height: 60px;
  }

  .zoom-indicator {
    bottom: 1rem;
    right: 1rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  .zoom-indicator span {
    display: none;
  }

  .lightbox-close,
  .lightbox-arrow {
    width: 45px;
    height: 45px;
  }

  .lightbox-close svg,
  .lightbox-arrow svg {
    width: 24px;
    height: 24px;
  }

  .lightbox-arrow-left {
    left: 1rem;
  }

  .lightbox-arrow-right {
    right: 1rem;
  }

  .lightbox-counter {
    bottom: 1rem;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}
</style>
