import React, { useState, useEffect } from 'react';
import { internshipAPI, applicationAPI } from '../services/api';

export default function InternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInternships();
  }, [search, workMode]);

  const fetchInternships = async () => {
    try {
      const res = await internshipAPI.getAll({ search, workMode });
      setInternships(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internshipId, status) => {
    try {
      const res = await applicationAPI.createOrUpdate({ internshipId, status });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Action failed');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="internships-page">
      <div className="page-header">
        <h2>Discover Internships</h2>
        <p>Explore opportunities matched against your profile skills.</p>
      </div>

      {message && <div className="toast-notification">{message}</div>}

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by role, company, or tech skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="filter-select">
          <option value="">All Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
      </div>

      {loading ? (
        <div className="loader">Searching opportunities...</div>
      ) : (
        <div className="internship-grid">
          {internships.map((item) => (
            <div key={item._id} className="internship-card">
              <div className="card-top">
                <div>
                  <h3 className="job-title">{item.title}</h3>
                  <p className="company-name">{item.company} • {item.location}</p>
                </div>
                <span className="badge badge-blue">{item.workMode}</span>
              </div>

              <div className="card-details">
                <span>💰 {item.stipend}</span>
                <span>⏳ {item.duration}</span>
              </div>

              <p className="description">{item.description}</p>

              <div className="skills-container">
                {item.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="skill-badge">{sk}</span>
                ))}
              </div>

              <div className="card-actions">
                <button onClick={() => handleApply(item._id, 'Applied')} className="btn btn-primary">
                  Apply & Track
                </button>
                <button onClick={() => handleApply(item._id, 'Saved')} className="btn btn-secondary">
                  🔖 Bookmark
                </button>
              </div>
            </div>
          ))}
          {internships.length === 0 && <p className="empty-text">No internships match your search.</p>}
        </div>
      )}
    </div>
  );
}
