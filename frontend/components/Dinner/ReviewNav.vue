<template>
  <div
    class="bg-gray-100 p-1.5 rounded-xl flex overflow-x-auto hide-scrollbar shadow-inner border border-gray-200/60"
  >
    <nav class="flex space-x-1 w-full min-w-max" aria-label="Tabs">
      <button
        @click="updateCurrentTab('review')"
        :class="[
          currentTab === 'review'
            ? 'bg-white text-black shadow-sm ring-1 ring-black/5'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50',
          'whitespace-nowrap py-2.5 px-4 rounded-lg font-medium text-sm flex items-center transition-all duration-200 outline-none flex-1 justify-center',
        ]"
      >
        Review Deck
        <span
          v-if="pendingApplications.length > 0"
          :class="[
            currentTab === 'review'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-600',
            'ml-2 py-0.5 px-2.5 rounded-full text-xs font-bold transition-colors',
          ]"
        >
          {{ pendingApplications.length }}
        </span>
      </button>

      <button
        @click="updateCurrentTab('approved')"
        :class="[
          currentTab === 'approved'
            ? 'bg-white text-green-700 shadow-sm ring-1 ring-black/5'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50',
          'whitespace-nowrap py-2.5 px-4 rounded-lg font-medium text-sm flex items-center transition-all duration-200 outline-none flex-1 justify-center',
        ]"
      >
        Approved
        <span
          :class="[
            currentTab === 'approved'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-600',
            'ml-2 py-0.5 px-2 rounded-full text-xs font-bold transition-colors',
          ]"
        >
          {{ approvedApplications.length }}
        </span>
      </button>

      <button
        @click="updateCurrentTab('unsent')"
        :class="[
          currentTab === 'unsent'
            ? 'bg-white text-yellow-700 shadow-sm ring-1 ring-black/5'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50',
          'whitespace-nowrap py-2.5 px-4 rounded-lg font-medium text-sm flex items-center transition-all duration-200 outline-none flex-1 justify-center',
        ]"
      >
        Unsent Mails
        <span
          :class="[
            currentTab === 'unsent'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-200 text-gray-600',
            'ml-2 py-0.5 px-2 rounded-full text-xs font-bold transition-colors',
          ]"
        >
          {{ unsentApplications.length }}
        </span>
      </button>

      <button
        @click="updateCurrentTab('rejected')"
        :class="[
          currentTab === 'rejected'
            ? 'bg-white text-red-700 shadow-sm ring-1 ring-black/5'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50',
          'whitespace-nowrap py-2.5 px-4 rounded-lg font-medium text-sm flex items-center transition-all duration-200 outline-none flex-1 justify-center',
        ]"
      >
        Rejected
        <span
          :class="[
            currentTab === 'rejected'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-200 text-gray-600',
            'ml-2 py-0.5 px-2 rounded-full text-xs font-bold transition-colors',
          ]"
        >
          {{ rejectedApplications.length }}
        </span>
      </button>
    </nav>
  </div>
</template>

<script setup>
const props = defineProps({
  currentTab: {
    type: String,
    required: true,
  },
  pendingApplications: {
    type: Array,
    required: true,
  },
  approvedApplications: {
    type: Array,
    required: true,
  },
  unsentApplications: {
    type: Array,
    required: true,
  },
  rejectedApplications: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:currentTab"]);
const updateCurrentTab = (tab) => {
  emit("update:currentTab", tab);
};
</script>
