import React from 'react';

const CATEGORY_COLORS = {
  Food: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  Travel: { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  Shopping: { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' },
  Bills: { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
  Education: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
  Health: { bg: '#FCE7F3', text: '#9D174D', border: '#FBCFE8' },
  Other: { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' }
};

export const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Education',
  'Health',
  'Other'
];

export default function CategoryBadge({ category }) {
  const style = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '600',
        display: 'inline-block',
        whiteSpace: 'nowrap'
      }}
    >
      {category}
    </span>
  );
}
