const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must contain at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
      match: [/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, hyphens, and periods'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email cannot exceed 254 characters'],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter a valid email address (e.g., student@college.edu)',
      ],
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
      uppercase: true,
      minlength: [3, 'Roll number must contain at least 3 characters'],
      maxlength: [30, 'Roll number cannot exceed 30 characters'],
      match: [
        /^[A-Z0-9\-_/]+$/,
        'Roll number must be alphanumeric (letters, numbers, hyphens, or slashes only)',
      ],
    },
    internshipId: {
      type: String,
      required: [true, 'Internship ID is required'],
      trim: true,
    },
    internshipTitle: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true,
    },
    // Optional field for backwards compatibility with earlier submissions
    internship: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Normalize rollNumber and preserve compatibility before saving
applicationSchema.pre('save', function (next) {
  if (this.rollNumber) {
    this.rollNumber = this.rollNumber.trim().toUpperCase();
  }
  if (!this.internship && this.internshipId) {
    this.internship = this.internshipId;
  }
  next();
});

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);
