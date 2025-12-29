<template>
  <section class="hero-section relative">
    <div ref="heroSlider" class="splide hero-slideshow">
      <div class="splide__track">
        <div class="splide__list">
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="splide__slide"
          >
            <img
              :src="slide.url"
              :alt="slide.alt"
              class="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Text Overlay -->
    <div class="hero-overlay absolute inset-0 flex items-center justify-start">
      <div
        class="hero-content text-left text-white px-4 flex flex-col items-start justify-center absolute left-[10%]"
      >
        <h2
          class="hero-title text-4xl md:text-6xl font-bold bg-black px-3 py-2 font-sharpie"
          style="text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7)"
        >
          {{ currentSlide.title }}
        </h2>
        <a
          :href="currentSlide.ctaLink"
          class="hero-cta inline-block bg-white text-black font-bold px-8 py-4 text-lg uppercase tracking-wider hover:bg-gray-100 transition-colors"
        >
          {{ currentSlide.ctaText }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";

const props = defineProps({
  slides: {
    type: Array,
    default: () => [
      {
        url: "https://placehold.co/1200x600/4A90E2/ffffff?text=Hero+Image+1",
        alt: "Hero image 1",
        title: "Get youun dnama!",
        ctaText: "SHOP NOW",
        ctaLink: "/products",
      },
      {
        url: "https://placehold.co/1200x600/E94B3C/ffffff?text=Hero+Image+2",
        alt: "Hero image 2",
        title: "Get youun dnama!",
        ctaText: "SHOP NOW",
        ctaLink: "/products",
      },
      {
        url: "https://placehold.co/1200x600/50C878/ffffff?text=Hero+Image+3",
        alt: "Hero image 3",
        title: "Get youun dnama!",
        ctaText: "SHOP NOW",
        ctaLink: "/products",
      },
    ],
  },
});

const heroSlider = ref(null);
const currentSlideIndex = ref(0);

const currentSlide = computed(() => {
  return props.slides[currentSlideIndex.value] || props.slides[0];
});

onMounted(() => {
  if (heroSlider.value) {
    const splide = new Splide(heroSlider.value, {
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
    });

    splide.on("move", (newIndex) => {
      currentSlideIndex.value = newIndex;
    });

    splide.mount();
  }
});
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  min-height: 500px;
  overflow: hidden;
}

.hero-slideshow {
  width: 100%;
  height: 100%;
}

.hero-slideshow img {
  min-height: 500px;
  max-height: 700px;
  object-fit: cover;
}

.hero-overlay {
  pointer-events: none;
  z-index: 10;
  background: rgba(0, 0, 0, 0.1);
}

.hero-content {
  pointer-events: auto;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-cta {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border-radius: 0;
  transition: all 0.3s ease;
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
  border-radius: 50%;
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

@media (max-width: 768px) {
  .hero-section {
    max-height: 500px;
  }

  .hero-slideshow img {
    max-height: 500px;
  }

  .hero-title {
    font-size: 2.5rem;
  }
}
</style>
