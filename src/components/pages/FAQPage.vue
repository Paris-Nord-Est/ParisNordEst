<template>
  <div class="faq-page">
    <div class="faq-header">
      <h1 class="faq-title">{{ t("faq.title") }}</h1>
      <p class="faq-subtitle">{{ t("faq.subtitle") }}</p>
    </div>

    <!-- Search Bar -->
    <div class="faq-search">
      <div class="search-input-wrapper">
        <svg
          class="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('faq.searchPlaceholder')"
          class="search-input"
        />
        <button
          v-if="searchQuery"
          class="clear-search"
          :aria-label="t('faq.clearSearch')"
          @click="searchQuery = ''"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- FAQ Sections -->
    <div class="faq-sections">
      <div
        v-for="sectionKey in ['payment', 'shipping']"
        :key="sectionKey"
        class="faq-section"
      >
        <template v-if="getFilteredQuestions(sectionKey).length > 0">
          <h2 class="section-title">
            <svg
              class="section-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path :d="sectionIcons[sectionKey]"></path>
            </svg>
            {{ t(`faq.sections.${sectionKey}.title`) }}
          </h2>

          <div class="faq-items">
            <div
              v-for="questionKey in getFilteredQuestions(sectionKey)"
              :key="questionKey"
              class="faq-item"
              :class="{ active: isOpen(sectionKey, questionKey) }"
            >
              <button
                class="faq-question"
                :aria-expanded="isOpen(sectionKey, questionKey)"
                @click="toggleItem(sectionKey, questionKey)"
              >
                <span class="question-text">{{
                  t(
                    `faq.sections.${sectionKey}.questions.${questionKey}.question`
                  )
                }}</span>
                <svg
                  class="chevron-icon"
                  :class="{ rotated: isOpen(sectionKey, questionKey) }"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <transition name="expand">
                <div
                  v-if="isOpen(sectionKey, questionKey)"
                  class="faq-answer-wrapper"
                >
                  <div
                    class="faq-answer"
                    v-html="
                      t(
                        `faq.sections.${sectionKey}.questions.${questionKey}.answer`
                      )
                    "
                  ></div>
                </div>
              </transition>
            </div>
          </div>
        </template>
      </div>

      <!-- No Results Message -->
      <div v-if="noResults" class="no-results">
        <svg
          class="no-results-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <p>{{ t("faq.noResults") }}</p>
        <button class="clear-search-btn" @click="searchQuery = ''">
          {{ t("faq.clearSearch") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const searchQuery = ref("");
const openItems = ref({});

// Section icons
const sectionIcons = {
  payment:
    "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  shipping:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
};

// All question keys for each section
const sectionQuestions = {
  payment: ["methods", "when", "issues", "security"],
  shipping: ["time", "missing", "international", "tracking"],
};

// Toggle accordion item
const toggleItem = (sectionKey, questionKey) => {
  const key = `${sectionKey}-${questionKey}`;
  openItems.value[key] = !openItems.value[key];
};

// Check if item is open
const isOpen = (sectionKey, questionKey) => {
  const key = `${sectionKey}-${questionKey}`;
  return openItems.value[key] || false;
};

// Get filtered questions for a section based on search
const getFilteredQuestions = (sectionKey) => {
  if (!searchQuery.value.trim()) {
    return sectionQuestions[sectionKey];
  }

  const query = searchQuery.value.toLowerCase();
  return sectionQuestions[sectionKey].filter((questionKey) => {
    const question = t(
      `faq.sections.${sectionKey}.questions.${questionKey}.question`
    ).toLowerCase();
    const answer = t(
      `faq.sections.${sectionKey}.questions.${questionKey}.answer`
    ).toLowerCase();
    return question.includes(query) || answer.includes(query);
  });
};

// Check if there are no results
const noResults = computed(() => {
  if (!searchQuery.value.trim()) return false;

  const hasPaymentResults = getFilteredQuestions("payment").length > 0;
  const hasShippingResults = getFilteredQuestions("shipping").length > 0;

  return !hasPaymentResults && !hasShippingResults;
});
</script>

<style lang="scss" scoped>
.faq-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;

  @media (min-width: 768px) {
    padding: 3rem 2rem 5rem;
  }
}

.faq-header {
  text-align: center;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    margin-bottom: 4rem;
  }
}

.faq-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
}

.faq-subtitle {
  font-size: 1.125rem;
  color: #666;
  margin: 0;
}

/* Search Bar */
.faq-search {
  margin-bottom: 3rem;
}

.search-input-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  font-size: 1rem;
  border: 2px solid #e5e5e5;
  border-radius: 50px;
  transition: all 0.2s ease;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #999;
  }
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: #1a1a1a;
  }
}

/* FAQ Sections */
.faq-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.faq-section {
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    @media (min-width: 768px) {
      font-size: 1.75rem;
    }
  }

  .section-icon {
    width: 28px;
    height: 28px;
    color: #1a1a1a;

    @media (min-width: 768px) {
      width: 32px;
      height: 32px;
    }
  }
}

.faq-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* FAQ Item */
.faq-item {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #d0d0d0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &.active {
    border-color: #1a1a1a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.faq-question {
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9f9f9;
  }

  .question-text {
    font-size: 1.0625rem;
    font-weight: 500;
    color: #1a1a1a;
    flex: 1;
    line-height: 1.5;
  }

  .chevron-icon {
    width: 20px;
    height: 20px;
    color: #666;
    transition: transform 0.3s ease, color 0.2s ease;
    flex-shrink: 0;

    &.rotated {
      transform: rotate(180deg);
      color: #1a1a1a;
    }
  }
}

/* Answer */
.faq-answer-wrapper {
  margin-top: 1.5rem;
  overflow: hidden;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #555;
  line-height: 1.7;
  font-size: 0.9375rem;

  :deep(strong) {
    color: #1a1a1a;
    font-weight: 600;
  }

  :deep(a) {
    color: #1a1a1a;
    text-decoration: underline;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  :deep(br) {
    display: block;
    content: "";
    margin-top: 0.5rem;
  }

  :deep(em) {
    font-style: italic;
    color: #666;
  }

  :deep(ul) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
}

/* Expand Transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;

  .no-results-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.5rem;
    color: #ccc;
  }

  p {
    font-size: 1.125rem;
    margin-bottom: 1.5rem;
  }

  .clear-search-btn {
    padding: 0.75rem 2rem;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #333;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
