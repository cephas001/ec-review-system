// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// --- REGISTER ROUTE ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if the reviewer already exists
    const userCheck = await db.query(
      "SELECT * FROM reviewers WHERE email = $1",
      [email],
    );
    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Reviewer with this email already exists." });
    }

    // 2. Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insert the new reviewer into the database
    const newUser = await db.query(
      "INSERT INTO reviewers (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email, passwordHash],
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

    // 1. Find the reviewer
    const userResult = await db.query(
      "SELECT * FROM reviewers WHERE email = $1",
      [email],
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const user = userResult.rows[0];

    // 2. Compare the passwords
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // 3. Generate the JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }, // Token expires in 8 hours
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
});

module.exports = router;
