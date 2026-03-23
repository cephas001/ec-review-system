// composables/useReviewUtils.js
export const useReviewUtils = () => {
  const formatName = (name) => {
    if (!name || typeof name !== "string") return "";
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatus = (row) => {
    if (!row) return "pending";
    const statusKey = Object.keys(row).find(
      (k) => k.toLowerCase() === "status",
    );
    return statusKey
      ? (row[statusKey] || "Pending").trim().toLowerCase()
      : "pending";
  };

  const getComment = (row) => {
    if (!row) return null;
    const commentKey = Object.keys(row).find((k) =>
      k.toLowerCase().includes("comment"),
    );
    return commentKey ? row[commentKey] : null;
  };

  const getReceiptKey = (applications) => {
    if (!applications || applications.length === 0) return null;
    return Object.keys(applications[0]).find(
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

  const formatHeader = (header) => {
    if (!header) return "";
    const lowerHeader = header.toLowerCase().trim();

    // Intercept the specific long table question
    if (lowerHeader.includes("what table would you love to sit at")) {
      return "Table Choice";
    }

    return header;
  };

  return {
    formatName,
    getStatus,
    getComment,
    getReceiptKey,
    extractFileId,
    formatHeader,
  };
};
