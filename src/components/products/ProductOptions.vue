<template>
  <div class="product-options">
    <!-- Single Option Select (no option groups) -->
    <div v-if="!hasOptionGroups && options.length > 1" class="option-select-container">
      <label :for="selectId" class="option-label">{{ t("product.selectVariant") }}</label>
      <div class="select-wrapper">
        <select
          :id="selectId"
          v-model="selectedOptionId"
          class="option-select"
          required
          @change="onOptionChange"
        >
          <option value="" disabled>{{ t("product.selectVariant") }}</option>
          <option
            v-for="option in options"
            :key="option.id"
            :value="option.id"
            :disabled="option.sold_out && !showSoldOutOptions"
          >
            {{ option.name }}
            <template v-if="option.sold_out"> ({{ t("products.soldOut") }})</template>
          </option>
        </select>
        <svg class="select-arrow" viewBox="0 0 15 7.6">
          <path d="M15 1.1l-7.5 6.5-7.5-6.3 1-1.2 6.5 5.5 6.5-5.6z" />
        </svg>
      </div>
    </div>

    <!-- Option Groups (multiple selects) -->
    <div v-else-if="hasOptionGroups" class="option-groups">
      <div v-for="group in optionGroups" :key="group.id" class="option-group">
        <label :for="`group-${group.id}`" class="option-label">{{ group.name }}</label>
        <div class="select-wrapper">
          <select
            :id="`group-${group.id}`"
            v-model="selectedGroups[group.id]"
            class="option-select"
            required
            @change="onGroupChange(group.id)"
          >
            <option value="" disabled>{{ group.name }}</option>
            <option
              v-for="value in group.values"
              :key="value.id"
              :value="value.id"
            >
              {{ value.name }}
            </option>
          </select>
          <svg class="select-arrow" viewBox="0 0 15 7.6">
            <path d="M15 1.1l-7.5 6.5-7.5-6.3 1-1.2 6.5 5.5 6.5-5.6z" />
          </svg>
        </div>
      </div>

      <!-- Reset button for option groups -->
      <button
        v-if="hasSelections"
        type="button"
        class="reset-button"
        @click="resetSelections"
      >
        {{ t("product.reset") }}
      </button>
    </div>

    <!-- Hidden input for form submission -->
    <input type="hidden" name="cart[add][id]" :value="selectedOptionId" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  optionGroups: {
    type: Array,
    default: () => [],
  },
  hasDefaultOption: {
    type: Boolean,
    default: false,
  },
  showSoldOutOptions: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["option-change"]);

// Generate unique ID for select
const selectId = `option-${Math.random().toString(36).substr(2, 9)}`;

// State
const selectedOptionId = ref("");
const selectedGroups = ref({});

// Computed
const hasOptionGroups = computed(() => props.optionGroups && props.optionGroups.length > 0);

const hasSelections = computed(() => {
  if (hasOptionGroups.value) {
    return Object.values(selectedGroups.value).some((v) => v);
  }
  return !!selectedOptionId.value;
});

// Find matching option ID from selected group values
const findMatchingOptionId = () => {
  if (!hasOptionGroups.value) return;

  const selectedValues = Object.values(selectedGroups.value).filter(Boolean);
  if (selectedValues.length !== props.optionGroups.length) {
    selectedOptionId.value = "";
    return;
  }

  // Find the option that matches all selected group values
  const matchingOption = props.options.find((option) => {
    // BigCartel options have option_group_values that we need to match
    if (option.option_group_values) {
      return selectedValues.every((selectedId) =>
        option.option_group_values.some((ogv) => ogv.id === selectedId)
      );
    }
    return false;
  });

  if (matchingOption) {
    selectedOptionId.value = matchingOption.id;
    emit("option-change", matchingOption);
  } else {
    selectedOptionId.value = "";
  }
};

// Event handlers
const onOptionChange = () => {
  const option = props.options.find((o) => o.id === selectedOptionId.value);
  if (option) {
    emit("option-change", option);
  }
};

const onGroupChange = () => {
  findMatchingOptionId();
};

const resetSelections = () => {
  selectedOptionId.value = "";
  selectedGroups.value = {};
  props.optionGroups.forEach((group) => {
    selectedGroups.value[group.id] = "";
  });
  emit("option-change", null);
};

// Initialize
onMounted(() => {
  // If there's only one option and it's the default, select it
  if (props.hasDefaultOption && props.options.length === 1) {
    selectedOptionId.value = props.options[0].id;
    emit("option-change", props.options[0]);
  }

  // Initialize group selections
  if (hasOptionGroups.value) {
    props.optionGroups.forEach((group) => {
      selectedGroups.value[group.id] = "";
    });
  }
});

// Watch for external changes
watch(
  () => props.options,
  () => {
    if (props.hasDefaultOption && props.options.length === 1) {
      selectedOptionId.value = props.options[0].id;
    }
  }
);
</script>

<style scoped>
.product-options {
  margin-bottom: 1rem;
}

.option-select-container,
.option-group {
  margin-bottom: 1rem;
}

.option-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.select-wrapper {
  position: relative;
}

.option-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  appearance: none;
  transition: border-color 0.2s;
}

.option-select:focus {
  outline: none;
  border-color: #000;
}

.option-select:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  pointer-events: none;
  fill: #666;
}

.option-groups {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reset-button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #666;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  color: #000;
  border-color: #000;
}
</style>
