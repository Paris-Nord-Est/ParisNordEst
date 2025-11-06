<template>
  <div class="products-listing">
    <!-- Page Header -->
    <section class="page-header py-8 md:py-12 px-4 text-center">
      <h1 class="page-title text-4xl md:text-5xl font-bold uppercase tracking-wide">
        {{ t('productsListing.title') }}
      </h1>
    </section>

    <!-- Products Grid -->
    <ProductGrid :limit="0" />
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import ProductGrid from "./ProductGrid.vue";

const { t } = useI18n();
</script>

<style scoped>
.products-listing {
  min-height: 60vh;
}

.page-header {
  background-color: #f9fafb;
}
</style>
