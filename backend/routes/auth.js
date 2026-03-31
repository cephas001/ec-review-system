// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { verifyToken, requireSuperAdmin } = require("../middleware/auth");

const router = express.Router();

// --- REGISTER ROUTE (PROTECTED: ONLY SUPER ADMINS CAN ACCESS) ---
router.post("/register", verifyToken, requireSuperAdmin, async (req, res) => {
  try {
    // Now accepting role and type from the request body!
    const { name, email, password, role = "admin", type = "dinner" } = req.body;

    const userCheck = await db.query(
      "SELECT * FROM reviewers WHERE email = $1",
      [email],
    );
    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Reviewer with this email already exists." });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert the new reviewer WITH role and type
    const newUser = await db.query(
      "INSERT INTO reviewers (name, email, password_hash, role, type) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, type",
      [name, email, passwordHash, role, type],
    );

    res.status(201).json({
      message: "Reviewer registered successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// --- LOGIN ROUTE ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await db.query(
      "SELECT * FROM reviewers WHERE email = $1",
      [email],
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Include TYPE in the JWT token payload!
    const token = jwt.sign(
      { id: user.id, role: user.role, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: user.type, // Send type back to frontend state
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
});

module.exports = router;
