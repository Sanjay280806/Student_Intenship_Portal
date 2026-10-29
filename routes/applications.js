const express = require("express");
const router = express.Router();

const Application = require("../models/application");
const internships = require("./internships");

router.post("/", async (req, res) => {
  try {
    const {
      studentName,
      email,
      rollNumber,
      internshipId
    } = req.body;

    if (
      !studentName?.trim() ||
      !email?.trim() ||
      !rollNumber?.trim() ||
      !internshipId
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    if (studentName.trim().length < 2) {
      return res.status(400).json({
        message: "Student name must contain at least 2 characters"
      });
    }

    if (rollNumber.trim().length > 30) {
      return res.status(400).json({
        message: "Roll number cannot exceed 30 characters"
      });
    }

    const internshipList = require("./internships").internshipData;
    const internship = internshipList
      ? internshipList.find((item) => item.id === internshipId)
      : null;

    // The application route also validates against the available internships.
    const availableInternships = [
      {
        id: "1",
        title: "Frontend Developer Intern"
      },
      {
        id: "2",
        title: "Backend Developer Intern"
      },
      {
        id: "3",
        title: "Full Stack Developer Intern"
      },
      {
        id: "4",
        title: "Data Analyst Intern"
      }
    ];

    const selectedInternship = availableInternships.find(
      (item) => item.id === internshipId
    );

    if (!selectedInternship) {
      return res.status(400).json({
        message: "Please select a valid internship"
      });
    }

    const application = await Application.create({
      studentName: studentName.trim(),
      email: email.trim().toLowerCase(),
      rollNumber: rollNumber.trim(),
      internshipId: selectedInternship.id,
      internshipTitle: selectedInternship.title
    });

    return res.status(201).json({
      message: "Application submitted successfully!",
      application
    });
  } catch (error) {
    console.error("Application submission error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", ")
      });
    }

    return res.status(500).json({
      message: "Failed to submit application. Please try again."
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error("Fetching applications error:", error);

    res.status(500).json({
      message: "Failed to retrieve applications"
    });
  }
});

module.exports = router;