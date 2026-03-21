<template>
  <div class="max-w-6xl mx-auto pb-24 md:pb-0 relative">
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-black">Workers Dinner Review</h1>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button
          @click="fetchApplications"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors"
        >
          <IconsRefresh :loading="loading" />
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
          >
            {{ approvedApplications.length }}
          </span>
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
          >
            {{ rejectedApplications.length }}
          </span>
        </button>
      </nav>
    </div>

    <div
      v-if="loading && applications.length === 0"
      class="flex justify-center items-center h-64 border-2 border-dashed border-gray-200 rounded-xl"
    >
      <IconsLoader />
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
          There are no pending dinner applications right now.
        </p>
      </div>

      <div
        v-else-if="currentApp"
        class="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden relative flex flex-col md:flex-row font-montserrat"
      >
        <div
          class="flex-1 p-6 pb-4 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col h-full"
        >
          <div
            class="mb-6 flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
          >
            <div class="flex items-center space-x-2">
              <button
                @click="prevApp"
                :disabled="currentIndex === 0"
                class="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <IconsLeftCaret />
              </button>
              <span class="text-xs font-semibold text-gray-600 tracking-wider">
                {{ currentIndex + 1 }} OF {{ pendingApplications.length }}
              </span>
              <button
                @click="nextApp"
                :disabled="currentIndex >= pendingApplications.length - 1"
                class="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <IconsRightCaret />
              </button>
            </div>
          </div>

          <div class="space-y-5 flex-1 overflow-y-auto mb-6 pr-2">
            <div
              v-for="header in dataHeaders"
              :key="header"
              class="border-b border-gray-50 pb-3 last:border-0"
            >
              <h4
                class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
              >
                {{ header }}
              </h4>
              <p
                class="text-sm text-black font-medium whitespace-pre-wrap tracking-wide"
              >
                {{ currentApp[header] || "—" }}
              </p>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-100">
              <label
                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
              >
                Reviewer Comments (Optional)
              </label>
              <textarea
                v-model="reviewComment"
                rows="3"
                placeholder="Leave a note about this application..."
                class="w-full text-sm border border-gray-300 focus:border-black rounded-lg p-3 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <div class="hidden md:flex mt-auto space-x-4">
            <button
              @click="updateStatus(currentApp._rowIndex, 'Rejected')"
              :disabled="updatingRow === currentApp._rowIndex"
              class="flex-1 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-3 px-4 rounded-xl transition-all disabled:opacity-50"
            >
              Reject
            </button>
            <button
              @click="updateStatus(currentApp._rowIndex, 'Approved')"
              :disabled="updatingRow === currentApp._rowIndex"
              class="flex-[2] bg-black text-white hover:bg-gray-800 py-3 px-4 rounded-xl transition-all disabled:opacity-50"
            >
              Approve Dinner
            </button>
          </div>
        </div>

        <div
          class="flex-1 bg-gray-50 p-4 md:p-6 flex flex-col items-center justify-center min-h-[550px] md:min-h-[700px]"
        >
          <h4
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 w-full text-left"
          >
            Uploaded Receipt
          </h4>

          <div
            class="w-full h-full flex items-center justify-center bg-white border border-gray-200 rounded-xl overflow-hidden relative shadow-inner"
          >
            <iframe
              v-if="currentReceiptUrl"
              :src="currentReceiptUrl"
              class="w-full h-full min-h-[550px] md:min-h-[700px] border-0"
              title="Receipt Viewer"
            ></iframe>

            <div v-else class="text-center p-8">
              <svg
                class="mx-auto h-12 w-12 text-gray-300 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p class="text-sm text-gray-500 font-medium">
                No valid receipt found.
              </p>
            </div>
          </div>

          <a
            v-if="currentReceiptUrl"
            :href="currentReceiptUrl"
            target="_blank"
            class="mt-4 text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
          >
            Open receipt in full screen
            <IconsNewTab />
          </a>
        </div>
      </div>

      <div
        v-if="pendingApplications.length > 0"
        class="md:hidden fixed bottom-6 left-6 z-30 flex flex-col space-y-2"
      >
        <button
          @click="updateStatus(currentApp._rowIndex, 'Approved')"
          :disabled="updatingRow === currentApp._rowIndex"
          class="bg-black text-white p-4 rounded-full hover:bg-black/90 disabled:opacity-50 transition-all flex items-center justify-center outline-none cursor-pointer"
          title="Approve Application"
        >
          <IconsTick />
        </button>

        <button
          @click="updateStatus(currentApp._rowIndex, 'Rejected')"
          :disabled="updatingRow === currentApp._rowIndex"
          class="bg-black text-red-600 p-4 rounded-full hover:bg-black/90 disabled:opacity-50 transition-all flex items-center justify-center outline-none cursor-pointer"
          title="Reject Application"
        >
          <IconsCancel />
        </button>
      </div>
    </div>

    <div
      v-else
      class="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl overflow-hidden font-montserrat"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="header in dataHeaders"
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
                :colspan="dataHeaders.length"
                class="px-6 py-12 text-center text-sm text-gray-500"
              >
                No {{ currentTab }} applications found.
              </td>
            </tr>
            <tr
              v-for="row in activeSummaryList"
              :key="row._rowIndex"
              @click="openDetailsModal(row)"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td
                v-for="header in dataHeaders"
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

    <div
      v-if="isModalOpen && selectedRow"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-montserrat"
    >
      <div
        class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        @click="isModalOpen = false"
      ></div>

      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
      >
        <button
          @click="isModalOpen = false"
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
            <div v-for="header in dataHeaders" :key="header">
              <span
                class="block text-xs font-semibold text-gray-400 uppercase"
                >{{ header }}</span
              >
              <span class="block text-sm text-gray-900 font-medium">{{
                selectedRow[header] || "—"
              }}</span>
            </div>

            <div
              v-if="getComment(selectedRow)"
              class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100"
            >
              <span
                class="block text-xs font-bold text-yellow-800 uppercase mb-1"
                >Reviewer Comment</span
              >
              <span class="block text-sm text-yellow-900">{{
                getComment(selectedRow)
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="flex-1 bg-gray-50 p-4 md:p-6 flex flex-col items-center justify-center min-h-[60vh] md:min-h-[600px]"
        >
          <iframe
            v-if="selectedReceiptUrl"
            :src="selectedReceiptUrl"
            class="w-full h-full min-h-[60vh] md:min-h-[600px] border border-gray-200 rounded-xl bg-white shadow-inner"
            title="Receipt Viewer"
          ></iframe>
          <div v-else class="text-sm text-gray-400">
            No receipt URL available.
          </div>
        </div>
      </div>
    </div>

    <button
      @click="showInfoPanel = !showInfoPanel"
      class="fixed bottom-10 right-10 z-40 text-black rounded-full shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center"
      title="Dinner Details"
    >
      <IconsInfo v-if="!showInfoPanel" />
      <IconsCancel v-else />
    </button>

    <DinnerInfoPanel v-if="showInfoPanel" />
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
const currentTab = ref("review");
const imageLoadError = ref(false);

// New Features State
const currentIndex = ref(0);
const reviewComment = ref("");
const showInfoPanel = ref(false);
const isModalOpen = ref(false);
const selectedRow = ref(null);

// --- Navigation Logic ---
const nextApp = () => {
  if (currentIndex.value < pendingApplications.value.length - 1) {
    currentIndex.value++;
    reviewComment.value = "";
  }
};

const prevApp = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    reviewComment.value = "";
  }
};

// --- Helper Functions ---
const getStatus = (row) => {
  const statusKey = Object.keys(row).find((k) => k.toLowerCase() === "status");
  return statusKey
    ? (row[statusKey] || "Pending").trim().toLowerCase()
    : "pending";
};

const getComment = (row) => {
  const commentKey = Object.keys(row).find((k) =>
    k.toLowerCase().includes("comment"),
  );
  return commentKey ? row[commentKey] : null;
};

const getReceiptKey = () => {
  if (applications.value.length === 0) return null;
  return Object.keys(applications.value[0]).find(
    (k) =>
      k.toLowerCase().includes("receipt") ||
      k.toLowerCase().includes("proof") ||
      k.toLowerCase().includes("upload") ||
      k.toLowerCase().includes("payment"),
  );
};

const extractFileId = (url) => {
  if (!url || typeof url !== "string") return null;
  const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD) return matchD[1];
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId) return matchId[1];
  return null;
};

// --- Computed Properties ---
const pendingApplications = computed(() =>
  applications.value.filter((app) => {
    const status = getStatus(app);
    return status !== "approved" && status !== "rejected";
  }),
);

const currentApp = computed(() => {
  if (pendingApplications.value.length === 0) return null;
  if (currentIndex.value >= pendingApplications.value.length) {
    currentIndex.value = Math.max(0, pendingApplications.value.length - 1);
  }
  return pendingApplications.value[currentIndex.value];
});

const approvedApplications = computed(() =>
  applications.value.filter((app) => getStatus(app) === "approved"),
);

const rejectedApplications = computed(() =>
  applications.value.filter((app) => getStatus(app) === "rejected"),
);

const activeSummaryList = computed(() =>
  currentTab.value === "approved"
    ? approvedApplications.value
    : rejectedApplications.value,
);

const dataHeaders = computed(() => {
  if (applications.value.length === 0) return [];
  const receiptKey = getReceiptKey();
  return Object.keys(applications.value[0]).filter(
    (key) =>
      key !== "_rowIndex" &&
      key.toLowerCase() !== "status" &&
      key.toLowerCase() !== "comment" &&
      key.toLowerCase() !== "comments" &&
      key !== receiptKey,
  );
});

// URLs for iframe viewer
const currentReceiptUrl = computed(() => {
  if (!currentApp.value || imageLoadError.value) return null;
  const receiptKey = getReceiptKey();
  if (!receiptKey || !currentApp.value[receiptKey]) return null;

  const fileId = extractFileId(currentApp.value[receiptKey]);
  if (!fileId) return null;

  return `${config.public.apiBase}/applications/receipt/${fileId}`;
});

const selectedReceiptUrl = computed(() => {
  if (!selectedRow.value) return null;
  const receiptKey = getReceiptKey();
  if (!receiptKey || !selectedRow.value[receiptKey]) return null;

  const fileId = extractFileId(selectedRow.value[receiptKey]);
  if (!fileId) return null;

  return `${config.public.apiBase}/applications/receipt/${fileId}`;
});

// --- Methods ---
const openDetailsModal = (row) => {
  selectedRow.value = row;
  isModalOpen.value = true;
};

const fetchApplications = async () => {
  loading.value = true;
  currentIndex.value = 0;
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
  imageLoadError.value = false;

  try {
    // Note: Dinner URL endpoint is correct here
    await $fetch(`${config.public.apiBase}/applications/dinner/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        rowIndex,
        status: newStatus,
        comment: reviewComment.value,
      },
    });

    const rowIndexInArray = applications.value.findIndex(
      (app) => app._rowIndex === rowIndex,
    );
    if (rowIndexInArray !== -1) {
      let statusKey = Object.keys(applications.value[rowIndexInArray]).find(
        (k) => k.toLowerCase() === "status",
      );
      if (!statusKey) statusKey = "Status";

      let commentKey = Object.keys(applications.value[rowIndexInArray]).find(
        (k) => k.toLowerCase() === "comment" || k.toLowerCase() === "comments",
      );
      if (!commentKey) commentKey = "Comments";

      applications.value[rowIndexInArray][statusKey] = newStatus;
      applications.value[rowIndexInArray][commentKey] = reviewComment.value;
    }

    reviewComment.value = "";

    if (currentIndex.value >= pendingApplications.value.length) {
      currentIndex.value = Math.max(0, pendingApplications.value.length - 1);
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

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out forwards;
}
</style>
