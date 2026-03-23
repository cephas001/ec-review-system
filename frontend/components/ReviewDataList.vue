<template>
  <div class="space-y-5 flex-1 overflow-y-auto mb-6 pr-2">
    <div
      v-for="header in headers"
      :key="header"
      class="border-b border-gray-50 pb-3 last:border-0"
    >
      <h4
        class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
      >
        {{ formatHeader(header) }}
      </h4>

      <slot name="field" :header="header" :value="data[header]">
        <p
          class="text-sm text-black font-medium whitespace-pre-wrap tracking-wide"
        >
          {{ data[header] || "—" }}
        </p>
      </slot>
    </div>

    <slot name="footer"></slot>
  </div>
</template>

<script setup>
import { useReviewUtils } from "~/composables/useReviewUtils";

const { formatHeader } = useReviewUtils();

defineProps({
  headers: { type: Array, required: true },
  data: { type: Object, required: true },
});
</script>
