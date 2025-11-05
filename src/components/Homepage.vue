<template>
  <div class="homepage">
    <!-- Hero Section with Slider -->
    <HeroSection
      :hero-title="config.hero.title"
      :cta-text="config.hero.ctaText"
      :cta-link="config.hero.ctaLink"
      :hero-images="config.hero.images"
    />

    ICI

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
    title: t("hero.title"),
    ctaText: t("hero.cta"),
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
