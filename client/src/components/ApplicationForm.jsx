import { useState } from 'react';
import { submitApplication } from '../api';

export default function ApplicationForm({ internship, onApplicationSuccess }) {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    rollNumber: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Validate an individual field and return its error message (or empty string if valid)
  const validateField = (name, value) => {
    const trimmed = String(value || '').trim();

    switch (name) {
      case 'studentName': {
        if (!trimmed) {
          return 'Full name is required.';
        }
        if (trimmed.length < 2) {
          return 'Name must be at least 2 characters long.';
        }
        if (trimmed.length > 80) {
          return 'Name cannot exceed 80 characters.';
        }
        const nameRegex = /^[a-zA-Z\s.'-]+$/;
        if (!nameRegex.test(trimmed) || !/[a-zA-Z]{2,}/.test(trimmed)) {
          return 'Name can only contain alphabetic letters, spaces, hyphens, and periods.';
        }
        return '';
      }

      case 'email': {
        if (!trimmed) {
          return 'Email address is required.';
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          return 'Please enter a valid email address (e.g., student@college.edu).';
        }
        if (trimmed.length > 254) {
          return 'Email cannot exceed 254 characters.';
        }
        return '';
      }

      case 'rollNumber': {
        if (!trimmed) {
          return 'Student roll number is required.';
        }
        if (trimmed.length < 3) {
          return 'Roll number must be at least 3 characters.';
        }
        if (trimmed.length > 30) {
          return 'Roll number cannot exceed 30 characters.';
        }
        const rollRegex = /^[a-zA-Z0-9\-_/]+$/;
        if (!rollRegex.test(trimmed) || !/[a-zA-Z0-9]/.test(trimmed)) {
          return 'Roll number must be alphanumeric (e.g., 24BCS101, CS-2024-001).';
        }
        return '';
      }

      default:
        return '';
    }
  };

  // Full form validation
  const validateForm = () => {
    const errors = {};
    const nameErr = validateField('studentName', formData.studentName);
    const emailErr = validateField('email', formData.email);
    const rollErr = validateField('rollNumber', formData.rollNumber);

    if (nameErr) errors.studentName = nameErr;
    if (emailErr) errors.email = emailErr;
    if (rollErr) errors.rollNumber = rollErr;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If the field was already touched, validate dynamically as the user types
    if (touched[name]) {
      const err = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
    setSubmitError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessData(null);

    // Mark all as touched
    setTouched({
      studentName: true,
      email: true,
      rollNumber: true,
    });

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        studentName: formData.studentName.trim(),
        email: formData.email.trim().toLowerCase(),
        rollNumber: formData.rollNumber.trim().toUpperCase(),
        internshipId: internship.id,
        internship: internship.id,
      };

      const result = await submitApplication(payload);

      setSuccessData({
        message: result.message || 'Application submitted successfully!',
        applicationId: result.applicationId || result.application?._id,
        studentName: payload.studentName,
        rollNumber: payload.rollNumber,
      });

      // Clear the form and reset touched states
      setFormData({
        studentName: '',
        email: '',
        rollNumber: '',
      });
      setFieldErrors({});
      setTouched({});

      if (onApplicationSuccess) {
        onApplicationSuccess(result);
      }
    } catch (err) {
      setSubmitError(
        err.message || 'An error occurred while submitting your application.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="application-form-card">
      <h2 className="form-heading">Apply for this Internship</h2>
      <p className="form-subheading">
        Fill out the details below to submit your official application.
      </p>

      {successData && (
        <div className="alert alert-success" role="alert">
          <div className="alert-icon">✓</div>
          <div>
            <strong>{successData.message}</strong>
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
              Student: <strong>{successData.studentName}</strong> (Roll: <strong>{successData.rollNumber}</strong>)
            </p>
            {successData.applicationId && (
              <p className="application-id-tag">
                Application Reference ID: <code>{successData.applicationId}</code>
              </p>
            )}
          </div>
        </div>
      )}

      {submitError && (
        <div className="alert alert-error" role="alert">
          <div className="alert-icon">⚠️</div>
          <div>
            <strong>Submission Error:</strong> {submitError}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="application-form">
        <div className="form-group">
          <label htmlFor="studentName" className="form-label">
            Full Name <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., Alex Johnson"
            maxLength={80}
            className={`form-input ${fieldErrors.studentName ? 'input-error' : ''}`}
            disabled={submitting}
            autoComplete="name"
            required
          />
          {fieldErrors.studentName && (
            <span className="field-error-message">{fieldErrors.studentName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required-star">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., alex.johnson@college.edu"
            maxLength={254}
            className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
            disabled={submitting}
            autoComplete="email"
            required
          />
          {fieldErrors.email && (
            <span className="field-error-message">{fieldErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rollNumber" className="form-label">
            Student Roll Number <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., 24BCS101 or CS-2024-001"
            maxLength={30}
            className={`form-input ${fieldErrors.rollNumber ? 'input-error' : ''}`}
            disabled={submitting}
            required
          />
          {fieldErrors.rollNumber && (
            <span className="field-error-message">{fieldErrors.rollNumber}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="selectedInternship" className="form-label">
            Selected Internship
          </label>
          <input
            type="text"
            id="selectedInternship"
            value={`${internship.title} — ${internship.company}`}
            readOnly
            disabled
            className="form-input form-input-readonly"
          />
        </div>

        <button
          type="submit"
          className="button primary button-block"
          disabled={submitting}
        >
          {submitting ? 'Submitting Application...' : 'Submit Application →'}
        </button>
      </form>
    </div>
  );
}
