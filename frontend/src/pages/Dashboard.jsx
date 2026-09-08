import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import expenseService from '../services/expenseService';
import ExpenseChart from '../components/ExpenseChart';
import CategoryBadge from '../components/CategoryBadge';

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalExpense: 0,
    totalCount: 0,
    categoryWiseTotal: {}
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryData, expensesData] = await Promise.all([
        expenseService.getSummary(),
        expenseService.getAll()
      ]);
      setSummary(summaryData);
      setRecentExpenses(expensesData.slice(0, 5)); // show latest 5
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not connect to backend server. Make sure the Spring Boot backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Determine top spending category
  const getTopCategory = () => {
    const entries = Object.entries(summary.categoryWiseTotal || {});
    if (entries.length === 0) return 'None';
    entries.sort((a, b) => b[1] - a[1]);
    return `${entries[0][0]} (₹${entries[0][1].toFixed(2)})`;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-card">
          <h3>Backend Connection Issue</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchDashboardData}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Expense Dashboard</h2>
          <p className="subtitle">Overview of your personal spending habits</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          + Add New Expense
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-green">₹</div>
          <div className="stat-info">
            <span className="stat-title">Total Spending</span>
            <span className="stat-value">₹{(summary.totalExpense || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">📊</div>
          <div className="stat-info">
            <span className="stat-title">Total Expenses</span>
            <span className="stat-value">{summary.totalCount || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">🏆</div>
          <div className="stat-info">
            <span className="stat-title">Top Category</span>
            <span className="stat-value stat-value-sm">{getTopCategory()}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Chart & Category Breakdown */}
      <div className="dashboard-grid">
        {/* Category Breakdown Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Category-Wise Spending</h3>
          </div>
          <ExpenseChart
            categoryWiseTotal={summary.categoryWiseTotal}
            totalExpense={summary.totalExpense}
          />
        </div>

        {/* Category Summary List */}
        <div className="card">
          <div className="card-header">
            <h3>Category Breakdown</h3>
          </div>
          {Object.keys(summary.categoryWiseTotal || {}).length === 0 ? (
            <p className="text-muted">No expenses recorded yet.</p>
          ) : (
            <ul className="category-list">
              {Object.entries(summary.categoryWiseTotal).map(([cat, amt]) => {
                const percent = summary.totalExpense > 0
                  ? ((amt / summary.totalExpense) * 100).toFixed(1)
                  : 0;
                return (
                  <li key={cat} className="category-item">
                    <div className="category-item-left">
                      <CategoryBadge category={cat} />
                    </div>
                    <div className="category-item-right">
                      <span className="category-item-amount">₹{amt.toFixed(2)}</span>
                      <span className="category-item-percent">({percent}%)</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card mt-4">
        <div className="card-header space-between">
          <h3>Recent Expenses</h3>
          <Link to="/expenses" className="btn btn-outline btn-sm">
            View All Expenses →
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses added yet.</p>
            <Link to="/add" className="btn btn-primary btn-sm">
              Record your first expense
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <strong>{exp.title}</strong>
                      {exp.description && (
                        <p className="table-subtext">{exp.description}</p>
                      )}
                    </td>
                    <td>
                      <CategoryBadge category={exp.category} />
                    </td>
                    <td>{exp.date}</td>
                    <td className="amount-cell">₹{exp.amount.toFixed(2)}</td>
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
