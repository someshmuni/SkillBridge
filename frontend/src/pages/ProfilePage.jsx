import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user.name || '', university: user.university || '', degree: user.degree || '', targetRole: user.targetRole || '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [message, setMessage] = useState('');

  const flash = (m) => { setMessage(m); setTimeout(() => setMessage(''), 3000); };
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      const res = await userAPI.updateProfile(form);
      setUser(res.data.user);
      flash('Profile updated');
    } catch (err) { flash(err.response?.data?.message || 'Update failed'); }
  };

  const addSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      const res = await userAPI.addSkill(newSkill.trim());
      setUser(res.data.user);
      setNewSkill('');
    } catch (err) { flash(err.response?.data?.message || 'Could not add skill'); }
  };

  const removeSkill = async (skill) => {
    const res = await userAPI.removeSkill(skill);
    setUser(res.data.user);
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Keep your skills up to date for accurate matching.</p>
      </div>
      {message && <div className="toast-notification">{message}</div>}

      <div className="dashboard-grid">
        <form className="card" onSubmit={save}>
          <h3>Details</h3>
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} required />
          <label>Email</label>
          <input value={user.email} disabled />
          <label>University</label>
          <input name="university" value={form.university} onChange={onChange} />
          <label>Degree</label>
          <input name="degree" value={form.degree} onChange={onChange} />
          <label>Target Role</label>
          <input name="targetRole" value={form.targetRole} onChange={onChange} />
          <button className="btn btn-primary">Save Changes</button>
        </form>

        <div className="card">
          <h3>My Skills</h3>
          <div className="skill-tags">
            {user.skills?.length === 0 && <p className="empty-text">No skills added yet.</p>}
            {user.skills?.map((s) => (
              <span key={s} className="skill-chip owned">
                {s} <button className="chip-x" onClick={() => removeSkill(s)} title="Remove">×</button>
              </span>
            ))}
          </div>
          <form onSubmit={addSkill} className="inline-form">
            <input placeholder="Add a skill, e.g. Docker" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
            <button className="btn btn-primary">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
}
