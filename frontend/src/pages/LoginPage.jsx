import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h2>Sign In</h2>
        <p className="subtext">Welcome back to SkillBridge.</p>
        {error && <div className="error-text">{error}</div>}
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} required />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} required />
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'}</button>
        <p className="subtext">No account? <Link to="/register">Create one</Link></p>
      </form>
    </div>
  );
}
