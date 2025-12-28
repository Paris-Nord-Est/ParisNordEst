<template>
  <div class="custom-page">
    <!-- Placeholder for custom/generic pages -->
    <!-- Will be implemented in Phase 5 -->
    <div class="custom-placeholder">
      <p>{{ t("customPage.comingSoon") }}</p>
      <p v-if="content">{{ t("customPage.contentPlaceholder") }}</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
