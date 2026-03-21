<template>
  <nav
    class="-mb-px flex space-x-6 overflow-x-auto font-poppins"
    aria-label="Tabs"
  >
    <button
      @click="updateCurrentTab('review')"
      :class="[
        currentTab === 'review'
          ? 'border-black text-black'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center',
      ]"
    >
      Review
      <span
        v-if="pendingApplications.length > 0"
        class="ml-2 bg-black text-white py-0.5 px-2.5 rounded-full text-xs"
      >
        {{ pendingApplications.length }}
      </span>
    </button>
    <button
      @click="updateCurrentTab('approved')"
      :class="[
        currentTab === 'approved'
          ? 'border-green-500 text-green-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center',
      ]"
    >
      Approved
      <span
        class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs"
      >
        {{ approvedApplications.length }}
      </span>
    </button>
    <button
      @click="updateCurrentTab('rejected')"
      :class="[
        currentTab === 'rejected'
          ? 'border-red-500 text-red-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center',
      ]"
    >
      Rejected
      <span
        class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs"
      >
        {{ rejectedApplications.length }}
      </span>
    </button>
  </nav>
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
