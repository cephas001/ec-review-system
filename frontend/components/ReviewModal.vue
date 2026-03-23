<template>
  <div
    v-if="isOpen && row"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-montserrat"
  >
    <div
      class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>

    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 z-10 text-gray-500"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        class="flex-1 p-6 md:p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-100"
      >
        <h3 class="text-lg font-bold text-gray-900 mb-6">Review Details</h3>

        <div class="space-y-4">
          <div v-for="header in headers" :key="header">
            <span class="block text-xs font-semibold text-gray-400 uppercase">{{
              header
            }}</span>
            <span class="block text-sm text-gray-900 font-medium">
              {{
                header.toLowerCase().includes("name")
                  ? formatName(row[header])
                  : row[header] || "—"
              }}
            </span>
          </div>

          <div
            v-if="getComment(row)"
            class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100"
          >
            <span class="block text-xs font-bold text-yellow-800 uppercase mb-1"
              >Reviewer Comment</span
            >
            <span class="block text-sm text-yellow-900">{{
              getComment(row)
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="flex-1 bg-gray-50 p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh] md:min-h-150 relative"
      >
        <ReceiptViewer :receiptUrl="receiptUrl" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReviewUtils } from "~/composables/useReviewUtils";
const { formatName, getComment } = useReviewUtils();

defineProps({
  isOpen: { type: Boolean, default: false },
  row: { type: Object, default: null },
  headers: { type: Array, default: () => [] },
  receiptUrl: { type: String, default: null },
});

defineEmits(["close"]);
</script>
