<template>
  <div class="contact-page">
    <!-- Placeholder for contact page -->
    <!-- Will be implemented in Phase 5 -->
    <div class="contact-placeholder">
      <p>{{ t("contact.comingSoon") }}</p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * ContactPage - Contact form page
 * Will include: HTML form for BigCartel contact submission
 * TODO: Implement in Phase 5
 */
</script>

<style scoped>
.contact-page {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-placeholder {
  text-align: center;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
