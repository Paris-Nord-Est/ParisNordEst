<template>
  <section class="hero-section relative">
    <div class="splide hero-slideshow" ref="heroSlider">
      <div class="splide__track">
        <div class="splide__list">
          <div
            v-for="(image, index) in heroImages"
            :key="index"
            class="splide__slide"
          >
            <img
              :src="image.url"
              :alt="image.alt"
              class="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Text Overlay -->
    <div
      class="hero-overlay absolute inset-0 flex items-center justify-center"
    >
      <div class="hero-content text-center text-white px-4">
        <h1
          class="hero-title text-5xl md:text-7xl font-bold mb-6 dela-gothic-one-regular"
          style="text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7)"
        >
          {{ heroTitle }}
        </h1>
        <a
          :href="ctaLink"
          class="hero-cta inline-block bg-white text-black font-bold px-8 py-4 text-lg uppercase tracking-wider hover:bg-gray-100 transition-colors"
        >
          {{ ctaText }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Splide from "@splidejs/splide";
import "@splidejs/splide/css";

const props = defineProps({
  heroTitle: {
    type: String,
    default: "Get youun dnama!",
  },
  ctaText: {
    type: String,
    default: "SHOP NOW",
  },
  ctaLink: {
    type: String,
    default: "/products",
  },
  heroImages: {
    type: Array,
    default: () => [
      {
        url: "https://via.placeholder.com/1200x600/4A90E2/ffffff?text=Hero+Image+1",
        alt: "Hero image 1",
      },
      {
        url: "https://via.placeholder.com/1200x600/E94B3C/ffffff?text=Hero+Image+2",
        alt: "Hero image 2",
      },
      {
        url: "https://via.placeholder.com/1200x600/50C878/ffffff?text=Hero+Image+3",
        alt: "Hero image 3",
      },
    ],
  },
});

const heroSlider = ref(null);

onMounted(() => {
  if (heroSlider.value) {
    new Splide(heroSlider.value, {
      type: "fade",
      rewind: true,
      pagination: false,
      arrows: true,
      keyboard: true,
      drag: true,
      autoplay: true,
      interval: 4000,
      pauseOnHover: true,
      pauseOnFocus: true,
    }).mount();
  }
});
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  min-height: 500px;
}

.hero-slideshow {
  width: 100%;
}

.hero-overlay {
  pointer-events: none;
  z-index: 10;
}

.hero-content {
  pointer-events: auto;
}

.hero-cta {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
}

/* Custom arrow styling for hero slider */
.hero-slideshow :deep(.splide__arrow) {
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: all 0.3s ease;
}

.hero-slideshow:hover :deep(.splide__arrow) {
  opacity: 1;
}

.hero-slideshow :deep(.splide__arrow:hover) {
  background: rgba(0, 0, 0, 0.6);
}

.hero-slideshow :deep(.splide__arrow svg) {
  fill: rgba(255, 255, 255, 0.9);
}

.hero-slideshow :deep(.splide__arrow--prev) {
  left: 20px;
}

.hero-slideshow :deep(.splide__arrow--next) {
  right: 20px;
}
</style>
