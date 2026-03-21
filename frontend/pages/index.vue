<template>
  <div class="max-w-4xl p-3">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">
      Welcome back, Reviewer
    </h1>
    <p class="text-gray-700 mb-8">
      Select a category from the sidebar to begin reviewing applications.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          Workers Dinner Applications
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          Review and approve requests for the upcoming dinner event.
        </p>
        <NuxtLink
          to="/dinner"
          class="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Go to Dinner App &rarr;
        </NuxtLink>
      </div>

      <div
        class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          EC Merch Applications
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          Verify payment receipts and manage merchandise claims.
        </p>
        <NuxtLink
          to="/merch"
          class="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Go to Merch App &rarr;
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// This page automatically uses the default layout we just created!
</script>
