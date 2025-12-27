<template>
  <div class="product-image-gallery">
    <!-- Main Image -->
    <div
      class="main-image-container"
      @mouseenter="zoomEnabled = true"
      @mouseleave="zoomEnabled = false"
      @mousemove="handleMouseMove"
      @click="openLightbox"
    >
      <transition name="fade" mode="out-in">
        <img
          :key="currentImageIndex"
          :src="currentImage.url"
          :alt="productName"
          class="main-image"
          :style="zoomEnabled ? zoomStyle : {}"
        />
      </transition>

      <!-- Zoom Indicator -->
      <div v-if="zoomEnabled" class="zoom-indicator">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </div>

      <!-- Navigation Arrows (for mobile) -->
      <button
        v-if="images.length > 1"
        @click.stop="previousImage"
        class="nav-arrow nav-arrow-left"
        aria-label="Image précédente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        v-if="images.length > 1"
        @click.stop="nextImage"
        class="nav-arrow nav-arrow-right"
        aria-label="Image suivante"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- Thumbnails -->
    <div v-if="images.length > 1" class="thumbnails-container">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="currentImageIndex = index"
        :class="['thumbnail', { active: index === currentImageIndex }]"
        :aria-label="`Voir image ${index + 1}`"
      >
        <img :src="image.thumb_url || image.url" :alt="`${productName} - Image ${index + 1}`" />
      </button>
    </div>

    <!-- Lightbox -->
    <transition name="lightbox-fade">
      <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
        <button @click.stop="closeLightbox" class="lightbox-close" aria-label="Fermer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <button
          v-if="images.length > 1"
          @click.stop="previousImage"
          class="lightbox-arrow lightbox-arrow-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <img
          :src="currentImage.url"
          :alt="productName"
          class="lightbox-image"
          @click.stop
        />

        <button
          v-if="images.length > 1"
          @click.stop="nextImage"
          class="lightbox-arrow lightbox-arrow-right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div class="lightbox-counter">{{ currentImageIndex + 1 }} / {{ images.length }}</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
});

const currentImageIndex = ref(0);
const zoomEnabled = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);
const lightboxOpen = ref(false);

const currentImage = computed(() => props.images[currentImageIndex.value] || props.images[0]);

const zoomStyle = computed(() => {
  if (!zoomEnabled.value) return {};

  return {
    transform: `scale(1.5)`,
    transformOrigin: `${mouseX.value}% ${mouseY.value}%`,
    cursor: 'zoom-in',
  };
});

const handleMouseMove = (event) => {
  if (!zoomEnabled.value) return;

  const rect = event.currentTarget.getBoundingClientRect();
  mouseX.value = ((event.clientX - rect.left) / rect.width) * 100;
  mouseY.value = ((event.clientY - rect.top) / rect.height) * 100;
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length;
};

const previousImage = () => {
  currentImageIndex.value =
    currentImageIndex.value === 0
      ? props.images.length - 1
      : currentImageIndex.value - 1;
};

const openLightbox = () => {
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = '';
};

// Keyboard navigation
const handleKeyDown = (event) => {
  if (!lightboxOpen.value) return;

  if (event.key === 'Escape') {
    closeLightbox();
  } else if (event.key === 'ArrowLeft') {
    previousImage();
  } else if (event.key === 'ArrowRight') {
    nextImage();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>

<style lang="scss" scoped>
.product-image-gallery {
  width: 100%;
}

.main-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f8f8f8;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    .nav-arrow {
      opacity: 1;
    }
  }
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-indicator {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  animation: pulse 2s ease-in-out infinite;

  svg {
    width: 20px;
    height: 20px;
    stroke: white;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2;

  @media (max-width: 768px) {
    opacity: 1;
    width: 35px;
    height: 35px;
  }

  svg {
    width: 24px;
    height: 24px;

    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
  }

  &.nav-arrow-left {
    left: 1rem;
  }

  &.nav-arrow-right {
    right: 1rem;
  }
}

.thumbnails-container {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;

    &:hover {
      background: #999;
    }
  }
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  background: #f8f8f8;

  &:hover {
    border-color: #999;
    transform: translateY(-2px);
  }

  &.active {
    border-color: #000;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// Lightbox
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

  @media (max-width: 768px) {
    padding: 1rem;
  }
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

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    top: 1rem;
    right: 1rem;
  }

  svg {
    width: 28px;
    height: 28px;

    @media (max-width: 768px) {
      width: 24px;
      height: 24px;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
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

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }

  svg {
    width: 32px;
    height: 32px;

    @media (max-width: 768px) {
      width: 24px;
      height: 24px;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }

  &.lightbox-arrow-left {
    left: 2rem;

    @media (max-width: 768px) {
      left: 1rem;
    }
  }

  &.lightbox-arrow-right {
    right: 2rem;

    @media (max-width: 768px) {
      right: 1rem;
    }
  }
}

.lightbox-counter {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    bottom: 1rem;
    font-size: 0.9rem;
  }
}
</style>
