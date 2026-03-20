// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors()); // Allows frontend to make requests to this API
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Routes
app.use("/api/auth", authRoutes);

// Basic Health Check Route
app.get("/api/health", async (req, res) => {
  try {
    // Quick query to test DB connection
    const result = await db.query("SELECT NOW()");
    res.status(200).json({
      status: "success",
      message: "EC Review System API is running smoothly.",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      status: "error",
      message: "API is running, but database connection failed.",
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
