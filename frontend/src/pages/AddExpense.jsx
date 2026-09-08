import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import expenseService from '../services/expenseService';
import { CATEGORIES } from '../components/CategoryBadge';

export default function AddExpense() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: today,
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Amount must be greater than 0';
    }
    if (!formData.category.trim()) {
      errs.category = 'Category is required';
    }
    if (!formData.date) {
      errs.date = 'Date is required';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear field-specific error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setServerError(null);
      await expenseService.create({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      navigate('/expenses');
    } catch (err) {
      console.error('Failed to create expense:', err);
      if (err.response?.data?.validationErrors) {
        setErrors(err.response.data.validationErrors);
      } else {
        setServerError(
          err.response?.data?.message || 'Failed to save expense. Please check your backend connection.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container page-container-narrow">
      <div className="page-header">
        <div>
          <h2>Add New Expense</h2>
          <p className="subtitle">Enter details of your expense below</p>
        </div>
      </div>

      <div className="card">
        {serverError && (
          <div className="alert alert-danger">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g., Grocery Shopping, Metro Pass"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Amount and Category Grid */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="amount" className="form-label">
                Amount (₹) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0.01"
                className={`form-input ${errors.amount ? 'input-error' : ''}`}
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
              />
              {errors.amount && <span className="error-text">{errors.amount}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                className={`form-select ${errors.category ? 'input-error' : ''}`}
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className={`form-input ${errors.date ? 'input-error' : ''}`}
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="optional">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="form-textarea"
              placeholder="Add any extra notes or details..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Link to="/expenses" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
