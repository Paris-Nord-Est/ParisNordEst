<template>
  <div class="homepage">
    <!-- Hero Section with Slider -->
    <HeroSection
      :heroTitle="config.hero.title"
      :ctaText="config.hero.ctaText"
      :ctaLink="config.hero.ctaLink"
      :heroImages="config.hero.images"
    />

    <!-- First Product Grid -->
    <ProductGrid
      :title="config.firstGrid.title"
      :limit="config.firstGrid.limit"
    />

    <!-- Middle Banner -->
    <BannerSection
      :bannerTitle="config.banner.title"
      :bannerImage="config.banner.image"
      :bannerAlt="config.banner.alt"
      :showCta="config.banner.showCta"
      :ctaText="config.banner.ctaText"
      :ctaLink="config.banner.ctaLink"
    />

    <!-- Second Product Grid (Collection) -->
    <ProductGrid
      :title="config.secondGrid.title"
      :limit="config.secondGrid.limit"
    />

    <!-- Footer Content Section -->
    <section class="footer-content bg-black text-white py-16 px-4">
      <div class="container mx-auto max-w-4xl text-center">
        <!-- Logo/Icon -->
        <div class="footer-logo mb-6 flex justify-center">
          <div class="logo-container w-32 h-32">
            <!-- Simple logo placeholder - replace with actual logo -->
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              class="w-full h-full"
            >
              <circle cx="100" cy="70" r="50" fill="white" />
              <circle cx="75" cy="60" r="8" fill="black" />
              <circle cx="125" cy="60" r="8" fill="black" />
              <path
                d="M 70 80 Q 100 95 130 80"
                stroke="black"
                stroke-width="3"
                fill="none"
              />
              <path
                d="M 130 100 L 160 120"
                stroke="white"
                stroke-width="4"
                stroke-linecap="round"
              />
              <text
                x="100"
                y="160"
                font-family="Arial, sans-serif"
                font-size="32"
                font-weight="bold"
                fill="white"
                text-anchor="middle"
              >
                CASQUETTE
              </text>
            </svg>
          </div>
        </div>

        <!-- Footer Title -->
        <h3 class="footer-title text-3xl md:text-4xl font-bold mb-6 dela-gothic-one-regular">
          {{ config.footer.title }}
        </h3>

        <!-- Footer Description -->
        <p class="footer-description text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          {{ config.footer.description }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import HeroSection from "./HeroSection.vue";
import ProductGrid from "./ProductGrid.vue";
import BannerSection from "./BannerSection.vue";

// Homepage configuration
// You can easily modify these values or connect them to BigCartel settings later
const config = reactive({
  hero: {
    title: "Get youun dnama!",
    ctaText: "SHOP NOW",
    ctaLink: "/products",
    images: [
      {
        url: "https://via.placeholder.com/1400x700/4A90E2/ffffff?text=Hero+Slider+1",
        alt: "Hero image 1",
      },
      {
        url: "https://via.placeholder.com/1400x700/E94B3C/ffffff?text=Hero+Slider+2",
        alt: "Hero image 2",
      },
      {
        url: "https://via.placeholder.com/1400x700/50C878/ffffff?text=Hero+Slider+3",
        alt: "Hero image 3",
      },
    ],
  },
  firstGrid: {
    title: "",
    limit: 6,
  },
  banner: {
    title: "On a mis Paris Nord-Est<br>dans une casquette.",
    image: "https://via.placeholder.com/1400x600/2C5F2D/ffffff?text=Banner+Paris+Nord-Est",
    alt: "Paris Nord-Est Banner",
    showCta: true,
    ctaText: "SHOP NOW",
    ctaLink: "/products",
  },
  secondGrid: {
    title: "COLLECTION PARIS NORD-EST",
    limit: 6,
  },
  footer: {
    title: "Ici on fait des trucs cool pour ta tête",
    description:
      "Pas des décocos, pas des mensonges, juste de vraies casquettes conçues avec amour, conçues pour qu'elles te suivent dans tes pérégrinations – parce qu'une casquette c'est stylé. C'est fun, mais aussi sérieux. Pas un truc d'humour. Pas de blabla, juste du style qui détrône, des matières qui dureront longtemps. Et tout ça on le fabrique à Saint-Denis, parce que même les casquettes ont besoin d'un peu d'énergie parisienne.",
  },
});
</script>

<style scoped>
.homepage {
  width: 100%;
}

.footer-content {
  background-color: #1a1a1a;
}

.footer-logo {
  filter: drop-shadow(0 4px 6px rgba(255, 255, 255, 0.1));
}

.footer-description {
  line-height: 1.8;
  opacity: 0.95;
}
</style>
