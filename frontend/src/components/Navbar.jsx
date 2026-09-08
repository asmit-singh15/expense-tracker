import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon">💰</span>
          <span className="logo-text">ExpenseTracker</span>
        </NavLink>

        <nav className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/expenses"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Expenses
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-btn active' : 'nav-link nav-btn'
            }
          >
            + Add Expense
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
