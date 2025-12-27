<template>
  <component :is="currentComponent" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductData from "./components/ProductData.vue";
import ProductPage from "./components/ProductPage.vue";

const currentComponent = ref(ProductData);

onMounted(() => {
  // Check if we're on a product page
  const appDiv = document.getElementById('app');
  const page = appDiv?.getAttribute('data-page');

  if (page === 'product') {
    currentComponent.value = ProductPage;
  } else {
    currentComponent.value = ProductData;
  }
});
</script>
