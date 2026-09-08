import React from 'react';

const CATEGORY_COLORS = {
  Food: '#F59E0B',
  Travel: '#3B82F6',
  Shopping: '#8B5CF6',
  Bills: '#EF4444',
  Education: '#10B981',
  Health: '#EC4899',
  Other: '#6B7280'
};

export default function ExpenseChart({ categoryWiseTotal = {}, totalExpense = 0 }) {
  const categories = Object.keys(categoryWiseTotal);

  if (categories.length === 0 || totalExpense === 0) {
    return (
      <div className="chart-empty">
        <p>No expense data available to display the chart.</p>
      </div>
    );
  }

  // Find max category value for proportional scaling
  const maxAmount = Math.max(...Object.values(categoryWiseTotal), 1);

  return (
    <div className="expense-chart-container">
      <div className="chart-bars">
        {categories.map((category) => {
          const amount = categoryWiseTotal[category] || 0;
          const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0;
          const barWidth = Math.max((amount / maxAmount) * 100, 4); // minimum 4% width for visibility
          const color = CATEGORY_COLORS[category] || '#6B7280';

          return (
            <div key={category} className="chart-row">
              <div className="chart-label">
                <span className="category-indicator" style={{ backgroundColor: color }}></span>
                <span className="category-name">{category}</span>
              </div>

              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: color
                  }}
                ></div>
              </div>

              <div className="chart-value">
                <strong>₹{amount.toFixed(2)}</strong>
                <span className="chart-percent">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
