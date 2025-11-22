<template>
  <ProductsListing />
</template>

<script setup>
/**
 * ProductsPage - Wrapper for ProductsListing component
 * This is a page-level component that wraps the existing ProductsListing component
 * Will be enhanced with category filtering and better UX
 */
import ProductsListing from "../ProductsListing.vue";

// Props from data-* attributes on mount element
defineProps({
  category: {
    type: String,
    default: null,
  },
});
</script>
