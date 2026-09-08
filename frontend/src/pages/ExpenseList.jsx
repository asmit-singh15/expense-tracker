import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import expenseService from '../services/expenseService';
import CategoryBadge, { CATEGORIES } from '../components/CategoryBadge';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchExpenses = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseService.getAll(category === 'All' ? '' : category);
      setExpenses(data);
    } catch (err) {
      console.error('Failed to load expenses:', err);
      setError('Could not fetch expenses. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(categoryFilter);
  }, [categoryFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      setDeleteId(id);
      await expenseService.delete(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete expense:', err);
      alert('Failed to delete expense. Please try again.');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredTotal = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Expense List</h2>
          <p className="subtitle">View, filter, edit and manage all your expenses</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          + Add Expense
        </Link>
      </div>

      {/* Filter and Summary Bar */}
      <div className="filter-bar card">
        <div className="filter-controls">
          <label htmlFor="categoryFilter" className="filter-label">
            Filter by Category:
          </label>
          <select
            id="categoryFilter"
            className="form-select filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-stats">
          <span className="text-muted">Showing {expenses.length} records</span>
          <span className="filter-total">
            Total: <strong>₹{filteredTotal.toFixed(2)}</strong>
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card mt-3">
        {loading ? (
          <div className="loading-spinner">Loading expenses...</div>
        ) : error ? (
          <div className="error-card">
            <p>{error}</p>
            <button className="btn btn-primary btn-sm" onClick={() => fetchExpenses(categoryFilter)}>
              Retry
            </button>
          </div>
        ) : expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses found {categoryFilter !== 'All' ? `for category "${categoryFilter}"` : ''}.</p>
            <Link to="/add" className="btn btn-primary btn-sm">
              Add an Expense
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <div className="expense-title">{expense.title}</div>
                      {expense.description && (
                        <div className="table-subtext">{expense.description}</div>
                      )}
                    </td>
                    <td>
                      <CategoryBadge category={expense.category} />
                    </td>
                    <td>{expense.date}</td>
                    <td className="amount-cell">₹{expense.amount.toFixed(2)}</td>
                    <td className="text-right actions-cell">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => navigate(`/edit/${expense.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={deleteId === expense.id}
                        onClick={() => handleDelete(expense.id)}
                      >
                        {deleteId === expense.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
