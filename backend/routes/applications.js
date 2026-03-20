// backend/routes/applications.js
const express = require("express");
const { sheets, drive } = require("../config/google");
const router = express.Router();

// Helper function to convert Google Sheets array data into JSON objects
const formatSheetData = (rows) => {
  if (!rows || rows.length === 0) return [];

  const headers = rows[0];
  const data = rows.slice(1);

  return data.map((row, rowIndex) => {
    let rowObject = { _rowIndex: rowIndex + 2 }; // Keep track of the actual row number for updates later
    headers.forEach((header, index) => {
      rowObject[header] = row[index] || ""; // If a cell is blank, return an empty string
    });
    return rowObject;
  });
};

// --- GET ALL APPLICATIONS ---
// We use a dynamic parameter /:type to handle both 'dinner' and 'merch'
router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    let spreadsheetId = "";
    let range = "Form Responses 1"; // Default tab name for Google Forms

    // Determine which sheet to pull from based on the URL
    if (type === "dinner") {
      spreadsheetId = process.env.SHEET_ID_DINNER;
    } else if (type === "merch") {
      spreadsheetId = process.env.SHEET_ID_MERCH;
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid application type. Use "dinner" or "merch".' });
    }

    // Fetch the data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    const formattedData = formatSheetData(rows);

    res.status(200).json({
      message: `Successfully fetched ${type} applications`,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Google Sheets fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data from Google Sheets." });
  }
});

// Helper function to convert a column index (0, 1, 2) to a letter (A, B, C)
const getColumnLetter = (index) => {
  let temp,
    letter = "";
  while (index >= 0) {
    temp = index % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    index = (index - temp - 26) / 26;
  }
  return letter;
};

// --- UPDATE APPLICATION STATUS ---
router.patch("/:type/status", async (req, res) => {
  try {
    const { type } = req.params;
    const { rowIndex, status } = req.body; // We need the row number and the new status

    // 1. Validate inputs
    if (!rowIndex || !status) {
      return res
        .status(400)
        .json({ error: "Missing rowIndex or status in request body." });
    }

    const validStatuses = ["Approved", "Rejected", "Pending"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Use Approved, Rejected, or Pending." });
    }

    // 2. Determine the correct Spreadsheet ID
    let spreadsheetId =
      type === "dinner"
        ? process.env.SHEET_ID_DINNER
        : process.env.SHEET_ID_MERCH;
    if (!spreadsheetId) {
      return res.status(400).json({ error: "Invalid application type." });
    }

    // 3. Find which column contains "Status"
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Form Responses 1!1:1", // Only fetch the first row
    });

    const headers = headerResponse.data.values[0];
    const statusColIndex = headers.findIndex(
      (h) => h.trim().toLowerCase() === "status",
    );

    if (statusColIndex === -1) {
      return res.status(500).json({
        error: 'A "Status" column was not found in the Google Sheet headers.',
      });
    }

    const statusColLetter = getColumnLetter(statusColIndex);
    const cellRange = `Form Responses 1!${statusColLetter}${rowIndex}`;

    // 4. Update the specific cell
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: cellRange,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[status]], // Google Sheets expects an array of arrays for updates
      },
    });

    res.status(200).json({
      message: `Successfully updated row ${rowIndex} to ${status}`,
    });
  } catch (error) {
    console.error("Google Sheets update error:", error);
    res
      .status(500)
      .json({ error: "Failed to update status in Google Sheets." });
  }
});

// --- GET RECEIPT MEDIA (PROXY) ---
router.get("/receipt/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    // STEP 1: Ask Google Drive for the file's metadata (specifically the MIME type)
    const metadata = await drive.files.get({
      fileId: fileId,
      fields: "mimeType, name",
    });

    const actualMimeType = metadata.data.mimeType;
    console.log("Real MIME type from metadata:", actualMimeType);

    // STEP 2: Fetch the actual file stream
    const response = await drive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" },
    );

    // STEP 3: Tell the browser EXACTLY what this file is so it renders inline
    res.setHeader("Content-Type", actualMimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${metadata.data.name}"`,
    );

    // STEP 4: Pipe the data directly to the client
    response.data
      .on("error", (err) => {
        console.error("Error streaming file:", err);
        if (!res.headersSent) {
          res.status(500).send("Error streaming file.");
        }
      })
      .pipe(res);
  } catch (error) {
    console.error("Google Drive proxy error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch receipt from Google Drive." });
  }
});

module.exports = router;
