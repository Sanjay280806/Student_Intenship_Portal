const express = require("express");
const router = express.Router();

const internships = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "Tech Solutions",
    location: "Remote",
    duration: "3 Months",
    stipend: "₹10,000/month",
    description:
      "Work with React, JavaScript, HTML and CSS to develop responsive web applications."
  },
  {
    id: "2",
    title: "Backend Developer Intern",
    company: "Innovate Labs",
    location: "Hybrid",
    duration: "6 Months",
    stipend: "₹15,000/month",
    description:
      "Develop REST APIs using Node.js, Express and MongoDB."
  },
  {
    id: "3",
    title: "Full Stack Developer Intern",
    company: "Digital Works",
    location: "Remote",
    duration: "4 Months",
    stipend: "₹12,000/month",
    description:
      "Build full-stack web applications using React, Node.js and databases."
  },
  {
    id: "4",
    title: "Data Analyst Intern",
    company: "Data Insights",
    location: "On-site",
    duration: "3 Months",
    stipend: "₹8,000/month",
    description:
      "Analyze datasets and create reports using Python, SQL and visualization tools."
  }
];

router.get("/", (req, res) => {
  res.json(internships);
});

router.get("/:id", (req, res) => {
  const internship = internships.find(
    (item) => item.id === req.params.id
  );

  if (!internship) {
    return res.status(404).json({
      message: "Internship not found"
    });
  }

  res.json(internship);
});

module.exports = router;