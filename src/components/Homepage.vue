<template>
  <div class="homepage">
    <!-- Hero Section with Slider -->
    <HeroSection :slides="config.hero.slides" />

    <!-- First Product Grid -->
    <ProductGrid
      :title="config.firstGrid.title"
      :limit="config.firstGrid.limit"
    />

    <!-- Middle Banner -->
    <BannerSection
      :banner-title="config.banner.title"
      :banner-image="config.banner.image"
      :banner-alt="config.banner.alt"
      :show-cta="config.banner.showCta"
      :cta-text="config.banner.ctaText"
      :cta-link="config.banner.ctaLink"
    />

    <!-- Second Product Grid (Collection) -->
    <ProductGrid
      :title="t('collection.title')"
      :limit="config.secondGrid.limit"
    />
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import HeroSection from "./HeroSection.vue";
import ProductGrid from "./ProductGrid.vue";
import BannerSection from "./BannerSection.vue";

const { t } = useI18n();

// Homepage configuration
const config = reactive({
  hero: {
    slides: [
      {
        url: "/images/home/slider/542599450_17854130469531086_412195545774409256_n.webp",
        alt: "Hero image 1 - Casquette Collection",
        title: t("hero.title"),
        ctaText: t("hero.cta"),
        ctaLink: "/products",
      },
      {
        url: "/images/home/slider/le-bar.jpg",
        alt: "Hero image 2 - Le Bar Collection",
        title: "Discover Le Bar",
        ctaText: "EXPLORE",
        ctaLink: "/collection/le-bar",
      },
    ],
  },
  firstGrid: {
    title: "",
    limit: 6,
  },
  banner: {
    title: t("banner.title"),
    image:
      "https://placehold.co/1600x600/2C3E50/FFFFFF?text=Paris+Nord-Est+Banner&font=montserrat",
    alt: "Paris Nord-Est Banner",
    showCta: true,
    ctaText: t("banner.cta"),
    ctaLink: "/products",
  },
  secondGrid: {
    limit: 6,
  },
});
</script>

<style scoped>
.homepage {
  width: 100%;
}
</style>
