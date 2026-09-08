import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import expenseService from '../services/expenseService';
import { CATEGORIES } from '../components/CategoryBadge';

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true);
        const data = await expenseService.getById(id);
        setFormData({
          title: data.title,
          amount: data.amount.toString(),
          category: data.category,
          date: data.date,
          description: data.description || ''
        });
      } catch (err) {
        console.error('Failed to load expense:', err);
        setServerError('Expense not found or server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

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
      await expenseService.update(id, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      navigate('/expenses');
    } catch (err) {
      console.error('Failed to update expense:', err);
      if (err.response?.data?.validationErrors) {
        setErrors(err.response.data.validationErrors);
      } else {
        setServerError(
          err.response?.data?.message || 'Failed to update expense. Please check your backend connection.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container page-container-narrow">
        <div className="loading-spinner">Loading expense details...</div>
      </div>
    );
  }

  if (serverError && !formData.title) {
    return (
      <div className="page-container page-container-narrow">
        <div className="error-card">
          <h3>Error</h3>
          <p>{serverError}</p>
          <Link to="/expenses" className="btn btn-primary btn-sm">
            Back to Expenses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container page-container-narrow">
      <div className="page-header">
        <div>
          <h2>Edit Expense</h2>
          <p className="subtitle">Update the expense information below</p>
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
              {submitting ? 'Updating...' : 'Update Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
