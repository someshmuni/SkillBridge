import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';

const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await applicationAPI.getAll(filter ? { status: filter } : {});
      setApps(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const changeStatus = async (id, status) => {
    await applicationAPI.updateStatus(id, { status });
    load();
  };
  const remove = async (id) => {
    if (!window.confirm('Remove this application?')) return;
    await applicationAPI.delete(id);
    load();
  };

  return (
    <div className="applications-page">
      <div className="page-header">
        <h2>My Applications</h2>
        <p>Update your status as you progress through each stage.</p>
      </div>

      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="loader">Loading applications...</div> : (
        <div className="card">
          {apps.length === 0 ? <p className="empty-text">Nothing here yet.</p> : (
            <div className="table-responsive">
              <table className="app-table">
                <thead>
                  <tr><th>Role</th><th>Company</th><th>Match</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a._id}>
                      <td><strong>{a.internship?.title}</strong></td>
                      <td>{a.internship?.company}</td>
                      <td><strong>{a.matchPercentage}%</strong></td>
                      <td>
                        <select value={a.status} onChange={(e) => changeStatus(a._id, e.target.value)} className={`filter-select status-${a.status.toLowerCase()}`}>
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td><button className="btn btn-danger" onClick={() => remove(a._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
