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
        <div class="footer-logo mb-8 flex justify-center">
          <div class="logo-container w-40 h-40">
            <!-- Circular logo with smiley face -->
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              class="w-full h-full"
            >
              <!-- Outer circle border -->
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="white"
                stroke-width="3"
              />

              <!-- Smiley face -->
              <circle cx="70" cy="85" r="8" fill="white" />
              <circle cx="130" cy="85" r="8" fill="white" />
              <path
                d="M 60 120 Q 100 145 140 120"
                stroke="white"
                stroke-width="4"
                stroke-linecap="round"
                fill="none"
              />

              <!-- CASQUETTE text curved at bottom -->
              <path
                id="circlePath"
                d="M 40,140 Q 100,170 160,140"
                fill="none"
              />
              <text
                font-family="Arial, sans-serif"
                font-size="16"
                font-weight="bold"
                fill="white"
                text-anchor="middle"
              >
                <textPath href="#circlePath" startOffset="50%">
                  CASQUETTE
                </textPath>
              </text>
            </svg>
          </div>
        </div>

        <!-- Footer Title -->
        <h3 class="footer-title text-3xl md:text-4xl font-bold mb-6">
          {{ config.footer.title }}
        </h3>

        <!-- Footer Description -->
        <p class="footer-description text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-10">
          {{ config.footer.description }}
        </p>

        <!-- Footer Links -->
        <nav class="footer-nav">
          <ul class="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base font-medium">
            <li><a href="/" class="hover:opacity-70 transition-opacity">ACCUEIL</a></li>
            <li class="hidden md:inline">-</li>
            <li><a href="/products" class="hover:opacity-70 transition-opacity">PRODUITS</a></li>
            <li class="hidden md:inline">-</li>
            <li><a href="/lookbook" class="hover:opacity-70 transition-opacity">LOOKBOOK</a></li>
            <li class="hidden md:inline">-</li>
            <li><a href="/contact" class="hover:opacity-70 transition-opacity">CONTACT</a></li>
            <li class="hidden md:inline">-</li>
            <li><a href="/cart" class="hover:opacity-70 transition-opacity">PANIER</a></li>
          </ul>
        </nav>
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
        url: "https://placehold.co/1600x700/4A90E2/FFFFFF?text=Hero+Casquette+1&font=montserrat",
        alt: "Hero image 1 - Casquette Collection",
      },
      {
        url: "https://placehold.co/1600x700/E94B3C/FFFFFF?text=Hero+Casquette+2&font=montserrat",
        alt: "Hero image 2 - Casquette Collection",
      },
      {
        url: "https://placehold.co/1600x700/50C878/FFFFFF?text=Hero+Casquette+3&font=montserrat",
        alt: "Hero image 3 - Casquette Collection",
      },
    ],
  },
  firstGrid: {
    title: "",
    limit: 6,
  },
  banner: {
    title: "On a mis Paris Nord-Est<br>dans une casquette.",
    image: "https://placehold.co/1600x600/2C3E50/FFFFFF?text=Paris+Nord-Est+Banner&font=montserrat",
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
