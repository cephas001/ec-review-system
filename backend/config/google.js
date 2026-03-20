// backend/config/google.js
const { google } = require("googleapis");
const path = require("path");

// Path to your service account key file
const KEYFILEPATH = path.join(__dirname, "../google-credentials.json");

// Define the scopes (permissions) the bot needs
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.readonly",
];

// Initialize the Auth client
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// Initialize the Sheets and Drive APIs
const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });

module.exports = {
  sheets,
  drive,
};
