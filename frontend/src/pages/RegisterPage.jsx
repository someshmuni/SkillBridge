import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', university: '', degree: '', targetRole: '', skills: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
      await register({ ...form, skills, targetRole: form.targetRole || undefined });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h2>Create Account</h2>
        {error && <div className="error-text">{error}</div>}
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={onChange} required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} required />
        <label>Password (min 6 characters)</label>
        <input name="password" type="password" minLength={6} value={form.password} onChange={onChange} required />
        <label>University</label>
        <input name="university" value={form.university} onChange={onChange} />
        <label>Degree</label>
        <input name="degree" value={form.degree} onChange={onChange} />
        <label>Target Role</label>
        <input name="targetRole" placeholder="Full-Stack Web Developer" value={form.targetRole} onChange={onChange} />
        <label>Skills (comma separated)</label>
        <input name="skills" placeholder="React.js, JavaScript, Git" value={form.skills} onChange={onChange} />
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Creating...' : 'Register'}</button>
        <p className="subtext">Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  );
}
