require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const internshipRoutes = require("./routes/internships");
const applicationRoutes = require("./routes/applications");

const app = express();

app.use(cors({
  origin: [
    "https://student-intenship-portal.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.json());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Student Internship Portal API is running"
  });
});

app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found"
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the environment");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
