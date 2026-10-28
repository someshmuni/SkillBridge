import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const cls = ({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <span className="sidebar-label">NAVIGATION</span>
        <NavLink to="/dashboard" className={cls}>📊 Dashboard</NavLink>
        <NavLink to="/internships" className={cls}>💼 Internships</NavLink>
        <NavLink to="/applications" className={cls}>📋 Applications</NavLink>
        <NavLink to="/skill-gap" className={cls}>🎯 Skill-Gap Analysis</NavLink>
        <NavLink to="/profile" className={cls}>👤 My Profile</NavLink>
      </div>

      {user && user.role === 'admin' && (
        <div className="sidebar-section">
          <span className="sidebar-label">ADMINISTRATION</span>
          <NavLink to="/admin" className={cls}>⚙️ Manage Internships</NavLink>
        </div>
      )}
    </aside>
  );
}
