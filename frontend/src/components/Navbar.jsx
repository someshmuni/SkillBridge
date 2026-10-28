import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-logo">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            <polyline points="10 2 10 10 13 7 16 10 16 2"/>
          </svg>
          <span className="brand-title">SkillBridge</span>
        </Link>
      </div>

      <div className="nav-user">
        {user ? (
          <div className="user-menu">
            <div className="user-avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role === 'admin' ? 'Administrator' : user.university || 'Student'}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout" title="Logout">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-btns">
            <Link to="/login" className="btn-link">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
