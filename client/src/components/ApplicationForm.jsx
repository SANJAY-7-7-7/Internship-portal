import { useState } from 'react';
import { submitApplication } from '../api';

export default function ApplicationForm({ internship, onApplicationSuccess }) {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    rollNumber: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const validate = () => {
    const errors = {};
    const name = formData.studentName.trim();
    const email = formData.email.trim();
    const roll = formData.rollNumber.trim();

    if (!name) {
      errors.studentName = 'Student name is required.';
    } else if (name.length < 2) {
      errors.studentName = 'Student name must be at least 2 characters.';
    } else if (name.length > 100) {
      errors.studentName = 'Student name cannot exceed 100 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please provide a valid email format (e.g., student@college.edu).';
    } else if (email.length > 254) {
      errors.email = 'Email cannot exceed 254 characters.';
    }

    if (!roll) {
      errors.rollNumber = 'Roll number is required.';
    } else if (roll.length > 40) {
      errors.rollNumber = 'Roll number cannot exceed 40 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessData(null);

    if (!validate()) {
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
      });

      // Clear the form
      setFormData({
        studentName: '',
        email: '',
        rollNumber: '',
      });
      setFieldErrors({});

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
            placeholder="e.g., Jane Doe"
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
            placeholder="e.g., student@university.edu"
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
            placeholder="e.g., 24BCS101"
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
