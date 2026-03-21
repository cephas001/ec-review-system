<template>
  <div class="max-w-5xl mx-auto pb-20 md:pb-0">
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
          Workers Dinner
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Process applications one by one.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button
          @click="fetchApplications"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg
            :class="{ 'animate-spin': loading }"
            class="mr-2 h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        <button
          @click="currentTab = 'review'"
          :class="[
            currentTab === 'review'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center',
          ]"
        >
          Review Deck
          <span
            v-if="pendingApplications.length > 0"
            class="ml-2 bg-black text-white py-0.5 px-2.5 rounded-full text-xs"
          >
            {{ pendingApplications.length }}
          </span>
        </button>
        <button
          @click="currentTab = 'approved'"
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
            >{{ approvedApplications.length }}</span
          >
        </button>
        <button
          @click="currentTab = 'rejected'"
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
            >{{ rejectedApplications.length }}</span
          >
        </button>
      </nav>
    </div>

    <div
      v-if="loading && applications.length === 0"
      class="flex justify-center items-center h-64 border-2 border-dashed border-gray-200 rounded-xl"
    >
      <svg
        class="h-8 w-8 text-gray-400 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    <div v-else-if="currentTab === 'review'">
      <div
        v-if="pendingApplications.length === 0"
        class="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
      >
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4"
        >
          <svg
            class="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">You're all caught up!</h3>
        <p class="mt-1 text-sm text-gray-500">
          There are no pending applications to review right now.
        </p>
      </div>

      <div
        v-else
        class="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden relative"
      >
        <div
          class="bg-gray-100 px-6 py-3 border-b border-gray-200 flex justify-between items-center text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          <span>Pending Review</span>
          <span>{{ pendingApplications.length }} Remaining</span>
        </div>

        <div class="p-6 md:p-8 space-y-6">
          <div
            v-for="header in tableHeaders"
            :key="header"
            class="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <h4
              class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
            >
              {{ header }}
            </h4>
            <p class="text-base text-gray-900 font-medium">
              {{ pendingApplications[0][header] || "—" }}
            </p>
          </div>
        </div>

        <div
          class="hidden md:flex border-t border-gray-100 p-6 bg-gray-50 space-x-4"
        >
          <button
            @click="updateStatus(pendingApplications[0]._rowIndex, 'Rejected')"
            :disabled="updatingRow === pendingApplications[0]._rowIndex"
            class="flex-1 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            Reject
          </button>
          <button
            @click="updateStatus(pendingApplications[0]._rowIndex, 'Approved')"
            :disabled="updatingRow === pendingApplications[0]._rowIndex"
            class="flex-1 bg-black text-white hover:bg-gray-800 font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            Approve
          </button>
        </div>
      </div>

      <div
        v-if="pendingApplications.length > 0"
        class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30 flex space-x-3"
      >
        <button
          @click="updateStatus(pendingApplications[0]._rowIndex, 'Rejected')"
          :disabled="updatingRow === pendingApplications[0]._rowIndex"
          class="flex-1 bg-red-100 text-red-700 font-bold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-50"
        >
          Reject
        </button>
        <button
          @click="updateStatus(pendingApplications[0]._rowIndex, 'Approved')"
          :disabled="updatingRow === pendingApplications[0]._rowIndex"
          class="flex-[2] bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-50 shadow-md"
        >
          Approve
        </button>
      </div>
    </div>

    <div
      v-else
      class="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="header in tableHeaders"
                :key="header"
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="activeSummaryList.length === 0">
              <td
                :colspan="tableHeaders.length"
                class="px-6 py-12 text-center text-sm text-gray-500"
              >
                No {{ currentTab }} applications found.
              </td>
            </tr>
            <tr
              v-for="row in activeSummaryList"
              :key="row._rowIndex"
              class="hover:bg-gray-50"
            >
              <td
                v-for="header in tableHeaders"
                :key="header"
                class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
              >
                {{ row[header] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRuntimeConfig, useCookie } from "#app";

const config = useRuntimeConfig();
const token = useCookie("ec_token");

const applications = ref([]);
const loading = ref(true);
const updatingRow = ref(null);

// Navigation State
const currentTab = ref("review"); // 'review', 'approved', 'rejected'

// Helper to normalize status strings safely
const getStatus = (row) => {
  const statusKey = Object.keys(row).find((k) => k.toLowerCase() === "status");
  return statusKey
    ? (row[statusKey] || "Pending").trim().toLowerCase()
    : "pending";
};

// Computed lists based on status
const pendingApplications = computed(() =>
  applications.value.filter((app) => {
    const status = getStatus(app);
    return status !== "approved" && status !== "rejected";
  }),
);

const approvedApplications = computed(() =>
  applications.value.filter((app) => getStatus(app) === "approved"),
);
const rejectedApplications = computed(() =>
  applications.value.filter((app) => getStatus(app) === "rejected"),
);

// Which list to show in the summary table
const activeSummaryList = computed(() => {
  return currentTab.value === "approved"
    ? approvedApplications.value
    : rejectedApplications.value;
});

const tableHeaders = computed(() => {
  if (applications.value.length === 0) return [];
  return Object.keys(applications.value[0]).filter(
    (key) => key !== "_rowIndex" && key.toLowerCase() !== "status",
  );
});

const fetchApplications = async () => {
  loading.value = true;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/applications/dinner`,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      },
    );
    applications.value = response.data;
  } catch (err) {
    console.error(err);
    alert("Failed to load data.");
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (rowIndex, newStatus) => {
  updatingRow.value = rowIndex;

  try {
    await $fetch(`${config.public.apiBase}/applications/dinner/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { rowIndex, status: newStatus },
    });

    // Update local state: The computed properties will instantly remove this card and show the next one!
    const rowIndexInArray = applications.value.findIndex(
      (app) => app._rowIndex === rowIndex,
    );
    if (rowIndexInArray !== -1) {
      let statusKey = Object.keys(applications.value[rowIndexInArray]).find(
        (k) => k.toLowerCase() === "status",
      );

      // If the sheet didn't return a status column because it was completely empty, create the key locally
      if (!statusKey) {
        statusKey = "Status";
      }

      applications.value[rowIndexInArray][statusKey] = newStatus;
    }
  } catch (err) {
    alert(err.data?.error || "Failed to update status.");
    console.error(err);
  } finally {
    updatingRow.value = null;
  }
};

onMounted(() => {
  fetchApplications();
});
</script>
