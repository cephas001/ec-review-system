import { ref, computed } from "vue";
import { useRuntimeConfig, useCookie } from "#app";
import { useReviewUtils } from "~/composables/useReviewUtils";

export const useReviewQueue = (endpoint) => {
  const config = useRuntimeConfig();
  const token = useCookie("ec_token");
  const { formatName, getStatus, getReceiptKey, extractFileId } =
    useReviewUtils();

  // --- Shared State ---
  const applications = ref([]);
  const loading = ref(true);
  const updatingRow = ref(null);
  const currentTab = ref("review");
  const imageLoadError = ref(false);
  const currentIndex = ref(0);
  const reviewComment = ref("");
  const showInfoPanel = ref(false);
  const isModalOpen = ref(false);
  const selectedRow = ref(null);
  const resendingRows = ref([]); // Specifically used by Dinner

  // --- Navigation ---
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

  const openDetailsModal = (row) => {
    selectedRow.value = row;
    isModalOpen.value = true;
  };

  // --- Computed Lists ---
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

  // Dinner-specific computed (safely returns empty if not applicable)
  const unsentApplications = computed(() =>
    approvedApplications.value.filter((app) => {
      const emailStatusKey = Object.keys(app).find(
        (k) => k.toLowerCase() === "email status",
      );
      const eStatus = emailStatusKey
        ? (app[emailStatusKey] || "").trim().toLowerCase()
        : "";
      return eStatus === "failed" || eStatus === "";
    }),
  );

  const activeSummaryList = computed(() => {
    if (currentTab.value === "approved") return approvedApplications.value;
    if (currentTab.value === "rejected") return rejectedApplications.value;
    if (currentTab.value === "unsent") return unsentApplications.value;
    return [];
  });

  const dataHeaders = computed(() => {
    if (applications.value.length === 0) return [];
    const receiptKey = getReceiptKey(applications.value);
    return Object.keys(applications.value[0]).filter(
      (key) =>
        key !== "_rowIndex" &&
        key.toLowerCase() !== "status" &&
        key.toLowerCase() !== "comment" &&
        key.toLowerCase() !== "comments" &&
        key.toLowerCase() !== "email status" &&
        key !== receiptKey,
    );
  });

  // --- Computed URLs ---
  const generateReceiptUrl = (row) => {
    if (!row) return null;
    const receiptKey = getReceiptKey(applications.value);
    if (!receiptKey || !row[receiptKey]) return null;
    const fileId = extractFileId(row[receiptKey]);
    return fileId
      ? `${config.public.apiBase}/applications/receipt/${fileId}`
      : null;
  };

  const currentReceiptUrl = computed(() =>
    imageLoadError.value ? null : generateReceiptUrl(currentApp.value),
  );
  const selectedReceiptUrl = computed(() =>
    generateReceiptUrl(selectedRow.value),
  );

  // --- API Methods ---
  const fetchApplications = async () => {
    loading.value = true;
    currentIndex.value = 0;
    try {
      const response = await $fetch(
        `${config.public.apiBase}/applications/${endpoint}`,
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

    const rowIndexInArray = applications.value.findIndex(
      (app) => app._rowIndex === rowIndex,
    );
    if (rowIndexInArray === -1) {
      updatingRow.value = null;
      return;
    }

    const app = applications.value[rowIndexInArray];

    // Base body
    const body = { rowIndex, status: newStatus, comment: reviewComment.value };

    // Dynamically inject Dinner-specific payload if we are on the dinner endpoint
    if (endpoint === "dinner") {
      const emailKey = Object.keys(app).find((k) =>
        k.toLowerCase().includes("email"),
      );
      const nameKey = Object.keys(app).find((k) =>
        k.toLowerCase().includes("name"),
      );
      const tableKey = Object.keys(app).find((k) =>
        k.toLowerCase().includes("table"),
      );

      body.applicantEmail = emailKey ? app[emailKey] : null;
      body.applicantName = nameKey ? formatName(app[nameKey]) : null;
      body.tableChoice = tableKey ? app[tableKey] : null;
    }

    try {
      await $fetch(`${config.public.apiBase}/applications/${endpoint}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token.value}` },
        body,
      });

      let statusKey =
        Object.keys(app).find((k) => k.toLowerCase() === "status") || "Status";
      let commentKey =
        Object.keys(app).find(
          (k) =>
            k.toLowerCase() === "comment" || k.toLowerCase() === "comments",
        ) || "Comments";

      applications.value[rowIndexInArray][statusKey] = newStatus;
      applications.value[rowIndexInArray][commentKey] = reviewComment.value;

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

  const resendEmail = async (row) => {
    resendingRows.value.push(row._rowIndex);
    const emailKey = Object.keys(row).find((k) =>
      k.toLowerCase().includes("email"),
    );
    const nameKey = Object.keys(row).find((k) =>
      k.toLowerCase().includes("name"),
    );
    const tableKey = Object.keys(row).find((k) =>
      k.toLowerCase().includes("table"),
    );

    try {
      await $fetch(`${config.public.apiBase}/applications/dinner/resend`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: {
          rowIndex: row._rowIndex,
          applicantEmail: row[emailKey],
          applicantName: formatName(row[nameKey]),
          tableChoice: row[tableKey],
        },
      });

      let emailStatusKey =
        Object.keys(row).find((k) => k.toLowerCase() === "email status") ||
        "Email Status";
      row[emailStatusKey] = "Sent";
      alert("Success! Ticket has been emailed.");
    } catch (err) {
      let emailStatusKey =
        Object.keys(row).find((k) => k.toLowerCase() === "email status") ||
        "Email Status";
      row[emailStatusKey] = "Failed";
      alert(err.data?.error || "Failed to send email.");
    } finally {
      resendingRows.value = resendingRows.value.filter(
        (id) => id !== row._rowIndex,
      );
    }
  };

  return {
    applications,
    loading,
    updatingRow,
    currentTab,
    currentIndex,
    reviewComment,
    showInfoPanel,
    isModalOpen,
    selectedRow,
    resendingRows,
    pendingApplications,
    currentApp,
    approvedApplications,
    rejectedApplications,
    unsentApplications,
    activeSummaryList,
    dataHeaders,
    currentReceiptUrl,
    selectedReceiptUrl,
    nextApp,
    prevApp,
    openDetailsModal,
    fetchApplications,
    updateStatus,
    resendEmail,
  };
};
