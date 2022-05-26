<template>
    <Product/>
</template>
<script>
import { onMounted } from '@vue/runtime-core';
import Product from "./components/Product.vue";

export default {
  components: {
    Product
  }
  onMounted: () => {
console.log('Vue mounted in theory')

  }
};
</script>