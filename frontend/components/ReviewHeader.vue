<template>
  <div class="sm:flex sm:items-center sm:justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-black">{{ titleText }}</h1>
    </div>
    <div class="mt-4 sm:mt-0 flex items-center space-x-3">
      <button
        @click="refresh"
        class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors"
      >
        <IconsRefresh :loading="loading" />
        Refresh
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  titleText: {
    type: String,
  },
});

const emit = defineEmits(["refresh"]);
const refresh = () => {
  emit("refresh");
};
</script>
