<template>
  <div class="cgv-page">
    <div class="cgv-header">
      <h1 class="cgv-title">{{ t("cgv.title") }}</h1>
      <p class="cgv-subtitle">{{ t("cgv.subtitle") }}</p>
    </div>

    <!-- Company Information -->
    <div class="company-info">
      <h2>{{ t("cgv.company.name") }}</h2>
      <p>{{ t("cgv.company.address") }}</p>
      <p>{{ t("cgv.company.rcs") }}</p>
    </div>

    <!-- Introduction -->
    <div class="cgv-intro">
      <p>{{ t("cgv.intro") }}</p>
    </div>

    <!-- CGV Sections -->
    <div class="cgv-sections">
      <article
        v-for="sectionKey in sectionKeys"
        :key="sectionKey"
        class="cgv-article"
      >
        <h3 class="article-title">
          {{ t(`cgv.sections.${sectionKey}.title`) }}
        </h3>
        <div
          class="article-content"
          v-html="t(`cgv.sections.${sectionKey}.content`)"
        ></div>
      </article>
    </div>

    <!-- Back to Shop -->
    <div class="cgv-footer">
      <a href="/" class="back-to-shop">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        {{ t("cgv.backToShop") }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// All CGV section keys in order
const sectionKeys = [
  "objet",
  "prix",
  "commandes",
  "validation",
  "paiement",
  "retractation",
  "disponibilite",
  "livraison",
  "garantie",
  "responsabilite",
  "litiges",
  "propriete",
  "donnees",
  "archivage",
];
</script>

<style lang="scss" scoped>
.cgv-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;

  @media (min-width: 768px) {
    padding: 3rem 2rem 5rem;
  }
}

.cgv-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e5e5e5;

  @media (min-width: 768px) {
    margin-bottom: 4rem;
  }
}

.cgv-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1a1a1a;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
}

.cgv-subtitle {
  font-size: 0.9375rem;
  color: #666;
  margin: 0;
  font-style: italic;
}

/* Company Information */
.company-info {
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.9375rem;
    color: #555;
    margin: 0.25rem 0;
  }
}

/* Introduction */
.cgv-intro {
  margin-bottom: 3rem;

  p {
    font-size: 1.0625rem;
    color: #333;
    line-height: 1.7;
    text-align: center;
    font-weight: 500;
  }
}

/* CGV Sections */
.cgv-sections {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.cgv-article {
  .article-title {
    font-size: 1.375rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #e5e5e5;

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }

  .article-content {
    color: #555;
    line-height: 1.8;
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
      margin-top: 0.75rem;
    }

    :deep(ul) {
      margin: 1rem 0;
      padding-left: 1.5rem;

      li {
        margin: 0.5rem 0;
      }
    }

    :deep(p) {
      margin-bottom: 1rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

/* Footer */
.cgv-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e5e5;
  text-align: center;
}

.back-to-shop {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: #1a1a1a;
  color: #fff;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
</style>
