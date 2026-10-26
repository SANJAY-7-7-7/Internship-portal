const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../models/Application');

// Seeded / Static Internship Catalogue
const internships = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer Intern',
    company: 'ByteWorks Technologies',
    location: 'Remote',
    duration: '3 months',
    stipend: '₹12,000/month',
    mode: 'Remote',
    description: 'Build responsive, accessible, and high-performance user interfaces using React, JavaScript, and modern CSS.',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer Intern',
    company: 'CloudNova Solutions',
    location: 'Bengaluru',
    duration: '6 months',
    stipend: '₹15,000/month',
    mode: 'Hybrid',
    description: 'Design and develop robust RESTful APIs, manage MongoDB databases, and implement scalable microservices.',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Docker'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst Intern',
    company: 'InsightLabs',
    location: 'Chennai',
    duration: '3 months',
    stipend: '₹10,000/month',
    mode: 'On-site',
    description: 'Analyze complex datasets, generate actionable insights, and build interactive dashboards.',
    skills: ['Python', 'SQL', 'Pandas', 'PowerBI', 'Data Visualization'],
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer Intern',
    company: 'NextGen Digital',
    location: 'Remote',
    duration: '6 months',
    stipend: '₹18,000/month',
    mode: 'Remote',
    description: 'Work across the entire MERN stack, delivering full-featured web applications from architecture to deployment.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
  },
  // Legacy catalogue entries so earlier submissions retain full details
  {
    id: 'web-development',
    title: 'Web Development Intern',
    company: 'ByteWorks Technologies',
    location: 'Remote',
    duration: '3 months',
    stipend: '₹12,000/month',
    mode: 'Remote',
    description: 'Build responsive web applications and work with modern frontend and backend technologies.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Intern',
    company: 'PixelWorks',
    location: 'Remote',
    duration: '2 months',
    stipend: '₹8,000/month',
    mode: 'Remote',
    description: 'Design user-friendly interfaces, create prototypes, and conduct usability research.',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'UI Design'],
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics Intern',
    company: 'DataSphere',
    location: 'Chennai',
    duration: '2 months',
    stipend: '₹7,000/month',
    mode: 'On-site',
    description: 'Analyze datasets, prepare reports, and discover useful business insights.',
    skills: ['Python', 'SQL', 'Excel', 'Data Visualization'],
  },
];

// Helper: check database readiness
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

// GET /api/internships
router.get('/internships', (req, res) => {
  res.json(internships);
});

// GET /api/internships/:id
router.get('/internships/:id', (req, res) => {
  const internship = internships.find((item) => item.id === req.params.id);

  if (!internship) {
    return res.status(404).json({ error: 'Internship not found' });
  }

  res.json(internship);
});

// POST /api/applications
router.post('/applications', async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        error: 'Database service is currently unavailable. Please try again shortly.',
      });
    }

    const { studentName, email, rollNumber } = req.body;
    const internshipIdentifier = req.body.internshipId || req.body.internship;

    // Validate required fields
    if (!studentName || !email || !rollNumber || !internshipIdentifier) {
      return res.status(400).json({
        error: 'All fields (studentName, email, rollNumber, internshipId) are required.',
      });
    }

    const trimmedName = String(studentName).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedRoll = String(rollNumber).trim().toUpperCase();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({
        error: 'Student name must be between 2 and 100 characters long.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 254) {
      return res.status(400).json({
        error: 'Please enter a valid email address.',
      });
    }

    if (trimmedRoll.length < 1 || trimmedRoll.length > 40) {
      return res.status(400).json({
        error: 'Roll number must be between 1 and 40 characters.',
      });
    }

    const matchedInternship = internships.find(
      (item) => item.id === internshipIdentifier
    );

    if (!matchedInternship) {
      return res.status(400).json({
        error: 'The selected internship ID is invalid or no longer available.',
      });
    }

    const newApplication = new Application({
      studentName: trimmedName,
      email: trimmedEmail,
      rollNumber: trimmedRoll,
      internshipId: matchedInternship.id,
      internshipTitle: matchedInternship.title,
      internship: matchedInternship.id,
    });

    const savedDoc = await newApplication.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: savedDoc._id,
      application: {
        ...savedDoc.toObject(),
        internshipTitle: matchedInternship.title,
        company: matchedInternship.company,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// GET /api/applications
router.get('/applications', async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        error: 'Database service is currently unavailable. Please try again shortly.',
      });
    }

    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .lean();

    const formattedApplications = applications.map((doc) => {
      const activeId = doc.internshipId || doc.internship;
      const matched = internships.find((item) => item.id === activeId);

      return {
        ...doc,
        internshipId: activeId,
        internshipTitle: doc.internshipTitle || matched?.title || 'Internship',
        company: matched?.company || 'Company',
      };
    });

    res.json(formattedApplications);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
