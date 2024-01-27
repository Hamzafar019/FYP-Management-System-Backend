// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // Number of salt rounds for bcrypt hashing
const User = require(`../models/users.js`);
const FYPregister = require(`../models/fyp_registrations.js`);
const authentication = require(`../middleware/authentication`);
const jwt = require("jsonwebtoken");
const adminauthentication = require("../middleware/adminauthentication.js");
const coordinatorauthentication = require("../middleware/coordinatorauthentication.js");
const db = require("../db");
const { Op } = require("sequelize");

router.post("/simple-endpoint", authentication, (req, res) => {
  const id = req.id;
  const name = req.name;
  const email = req.email;
  const role = req.role;
  console.log("email");
  res.send({ name, email, role });
});

router.get("/getsupervisors", async (req, res) => {
  try {
    // Find all supervisors from the User model
    const supervisors = await User.findAll({
      attributes: ["email"],
      where: {
        role: "supervisor",
      },
      raw: true,
    });

    // Extract supervisor emails
    const supervisorEmails = supervisors.map((supervisor) => supervisor.email);

    const emailCounts = {};
    supervisorEmails.forEach((email) => {
      emailCounts[email] = 0;
    });

    const fypRegisterRows = await FYPregister.findAll();

    // Checking the "supervisor" column of the FYP_register table and incrementing counts
    fypRegisterRows.forEach((row) => {
      if (row.supervisor) {
        supervisorEmails.forEach((email) => {
          if (row.supervisor.includes(email)) {
            emailCounts[email]++;
          }
        });
      }
    });
    const filteredEmailCounts = {};
    for (const email in emailCounts) {
      if (emailCounts[email] <= 2) {
        filteredEmailCounts[email] = emailCounts[email];
      }
    }

    console.log(filteredEmailCounts);

    res.status(200).json({ filteredEmailCounts });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/createUser", adminauthentication, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    // userroutes/users.js
    const secretKey = process.env.YOUR_SECRET_KEY || "fyp_management_system";
    console.log("Environment variable:", process.env.YOUR_SECRET_KEY);

    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log(secretKey);
    // Create and send a JWT token for authentication
    const token = jwt.sign(
      {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      secretKey, // Replace with a strong and secure secret key
      { expiresIn: "15m" } // Token expiration time (adjust as needed)
    );

    res.status(200).json({ token, role: existingUser.role });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
