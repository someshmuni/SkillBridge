import React from 'react';

export default function StatCard({ title, value, subtitle, icon, color = 'blue' }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <h3 className="stat-value">{value}</h3>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}
