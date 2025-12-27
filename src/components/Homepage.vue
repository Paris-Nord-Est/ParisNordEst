<template>
  <div class="homepage">
    <!-- Hero Section with Slider -->
    <HeroSection :slides="config.hero.slides" />

    <!-- First Product Grid - Non Paris Nord-Est Products -->
    <ProductGrid
      :title="config.firstGrid.title"
      :product-ids="config.firstGrid.productIds"
      :desktop-limit="config.firstGrid.desktopLimit"
      :mobile-limit="config.firstGrid.mobileLimit"
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

    <!-- Second Product Grid - Paris Nord-Est Collection -->
    <ProductGrid
      :title="t('collection.title')"
      :exclude-ids="config.secondGrid.excludeIds"
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
    productIds: [115392261, 102294355, 103866085], // Non Casquette products
    desktopLimit: 3,
    mobileLimit: 2,
  },
  banner: {
    title: t("banner.title"),
    image: "/images/home/banner/paris-nord-est-banner.jpg",
    alt: "Casquette Banner",
    showCta: true,
    ctaText: t("banner.cta"),
    ctaLink: "/products",
  },
  secondGrid: {
    excludeIds: [115392261, 102294355, 103866085], // Exclude non-Casquette products
    limit: 100, // Show all Casquette products
  },
});
</script>

<style scoped>
.homepage {
  width: 100%;
}
</style>
