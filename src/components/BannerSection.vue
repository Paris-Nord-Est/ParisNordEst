<template>
  <section class="banner-section relative w-full">
    <!-- Banner Image -->
    <div class="banner-image-container relative">
      <img
        :src="bannerImage"
        :alt="bannerAlt"
        class="w-full h-auto object-cover"
      />

      <!-- Text Overlay -->
      <div
        class="banner-overlay absolute inset-0 flex items-center justify-center"
      >
        <div class="banner-content text-center text-white px-4 max-w-2xl">
          <h2
            class="banner-title text-3xl md:text-5xl font-bold mb-4 font-sharpie"
            style="text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7)"
            v-html="bannerTitle"
          ></h2>
          <a
            v-if="showCta"
            :href="ctaLink"
            class="banner-cta inline-block bg-white text-black font-bold px-8 py-3 text-base uppercase tracking-wider hover:bg-gray-100 transition-colors"
          >
            {{ ctaText }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  bannerTitle: {
    type: String,
    default: "On a mis Paris Nord-Est<br>dans une casquette.",
  },
  bannerImage: {
    type: String,
    default: "https://placehold.co/1400x600/2C5F2D/ffffff?text=Banner+Image",
  },
  bannerAlt: {
    type: String,
    default: "Banner",
  },
  showCta: {
    type: Boolean,
    default: true,
  },
  ctaText: {
    type: String,
    default: "SHOP NOW",
  },
  ctaLink: {
    type: String,
    default: "/products",
  },
});
</script>

<style scoped>
.banner-section {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
}

.banner-image-container {
  position: relative;
  width: 100%;
  min-height: 500px;
  overflow: hidden;
}

.banner-image-container img {
  display: block;
  width: 100%;
  height: auto;
  min-height: 500px;
  max-height: 600px;
  object-fit: cover;
}

.banner-overlay {
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.banner-content {
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.banner-title {
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.banner-cta {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  border-radius: 0;
}

.banner-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 1.75rem;
  }

  .banner-image-container {
    min-height: 350px;
  }

  .banner-image-container img {
    min-height: 350px;
    max-height: 450px;
  }
}
</style>
