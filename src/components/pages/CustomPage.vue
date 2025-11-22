<template>
  <div class="custom-page">
    <!-- Placeholder for custom/generic pages -->
    <!-- Will be implemented in Phase 5 -->
    <div class="custom-placeholder">
      <p>Custom page Vue component - Coming soon</p>
      <p v-if="content">Content will be rendered here</p>
    </div>
  </div>
</template>

<script setup>
/**
 * CustomPage - Generic page renderer for custom BigCartel pages
 * (CGV, FAQ, About, etc.)
 * Will render HTML content from BigCartel
 * TODO: Implement in Phase 5
 */

// Props from data-* attributes on mount element
defineProps({
  content: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.custom-page {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-placeholder {
  text-align: center;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
