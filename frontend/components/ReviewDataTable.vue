<template>
  <div
    class="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl overflow-hidden font-montserrat"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              class="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
            >
              {{ header }}
            </th>

            <slot name="header-action"></slot>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="data.length === 0">
            <td
              :colspan="
                $slots['header-action'] ? headers.length + 1 : headers.length
              "
              class="px-6 py-12 text-center text-sm text-gray-500"
            >
              <slot name="empty-state">No applications found.</slot>
            </td>
          </tr>

          <tr
            v-for="row in data"
            :key="row._rowIndex"
            @click="$emit('row-click', row)"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td
              v-for="header in headers"
              :key="header"
              class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
            >
              {{
                header.toLowerCase().includes("name")
                  ? formatName(row[header])
                  : row[header]
              }}
            </td>

            <slot name="row-action" :row="row"></slot>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useReviewUtils } from "~/composables/useReviewUtils";
const { formatName } = useReviewUtils();

defineProps({
  headers: { type: Array, required: true },
  data: { type: Array, required: true },
});

defineEmits(["row-click"]);
</script>
