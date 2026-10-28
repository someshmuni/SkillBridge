import React, { useState, useEffect } from 'react';
import { internshipAPI, adminAPI } from '../services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const EMPTY = {
  title: '',
  company: '',
  location: '',
  workMode: 'Remote',
  stipend: '',
  duration: '',
  description: '',
  requiredSkills: '',
};

const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

const CHART_COLORS = [
  '#64748b',
  '#6366f1',
  '#0d9488',
  '#16a34a',
  '#dc2626',
];

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [applicationSearch, setApplicationSearch] = useState('');
  const [savingApplication, setSavingApplication] = useState(null);
  const [applicationEdits, setApplicationEdits] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const flash = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const load = async () => {
    try {
      const res = await internshipAPI.getAll();
      setItems(res.data.data || []);
    } catch (err) {
      flash(err.response?.data?.message || 'Could not load internships');
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);

    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      flash(err.response?.data?.message || 'Could not load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadApplications = async () => {
    setLoadingApplications(true);

    try {
      const res = await adminAPI.getApplications();
      setApplications(res.data.data || []);
    } catch (err) {
      flash(err.response?.data?.message || 'Could not load applications');
    } finally {
      setLoadingApplications(false);
    }
  };

  const loadAnalytics = async () => {
    setLoadingAnalytics(true);

    try {
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data.data || null);
    } catch (err) {
      console.error(
        'Failed to load analytics:',
        err.response?.data || err.message
      );
      setAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    load();
    loadUsers();
    loadApplications();
    loadAnalytics();
  }, []);

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      requiredSkills: form.requiredSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await internshipAPI.update(editingId, payload);
      } else {
        await internshipAPI.create(payload);
      }

      flash(editingId ? 'Internship updated' : 'Internship created');

      setForm(EMPTY);
      setEditingId(null);

      await Promise.all([
        load(),
        loadApplications(),
        loadAnalytics(),
      ]);
    } catch (err) {
      flash(err.response?.data?.message || 'Save failed');
    }
  };

  const edit = (internship) => {
    setEditingId(internship._id);

    setForm({
      title: internship.title || '',
      company: internship.company || '',
      location: internship.location || '',
      workMode: internship.workMode || 'Remote',
      stipend: internship.stipend || '',
      duration: internship.duration || '',
      description: internship.description || '',
      requiredSkills: (internship.requiredSkills || []).join(', '),
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this internship?')) return;

    try {
      await internshipAPI.delete(id);

      flash('Internship deleted');

      await Promise.all([
        load(),
        loadApplications(),
        loadAnalytics(),
      ]);
    } catch (err) {
      flash(err.response?.data?.message || 'Delete failed');
    }
  };

  const saveApplication = async (application) => {
    const edit = applicationEdits[application._id] || {};

    const payload = {
      status: edit.status ?? application.status,
      notes: edit.notes ?? application.notes ?? '',
    };

    setSavingApplication(application._id);

    try {
      await adminAPI.updateApplication(application._id, payload);

      flash('Application updated successfully');

      await Promise.all([
        loadApplications(),
        loadUsers(),
        loadAnalytics(),
      ]);

      setApplicationEdits((previous) => {
        const updated = { ...previous };
        delete updated[application._id];
        return updated;
      });
    } catch (err) {
      flash(
        err.response?.data?.message ||
          'Could not update application'
      );
    } finally {
      setSavingApplication(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    return (
      (user.name || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.university || '').toLowerCase().includes(query)
    );
  });

  const filteredApplications = applications.filter((app) => {
    const query = applicationSearch.toLowerCase();

    return (
      (app.user?.name || '').toLowerCase().includes(query) ||
      (app.user?.email || '').toLowerCase().includes(query) ||
      (app.internship?.title || '').toLowerCase().includes(query) ||
      (app.internship?.company || '').toLowerCase().includes(query) ||
      (app.status || '').toLowerCase().includes(query)
    );
  });

  const totalApplications = users.reduce(
    (total, user) => total + (user.applications || []).length,
    0
  );

  const statusCounts = STATUSES.map((status) => ({
    status,
    count: applications.filter((app) => app.status === status).length,
  }));

  const offers = applications.filter(
    (app) => app.status === 'Offer'
  ).length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>
          Manage internships, students, and application progress.
        </p>
      </div>

      {message && (
        <div className="toast-notification" role="status">
          {message}
        </div>
      )}

      {/* Dashboard Statistics */}
      <div className="form-grid">
        <div className="card">
          <h3>Registered Students</h3>
          <h2>
            {analytics?.totalStudents ?? users.length}
          </h2>
        </div>

        <div className="card">
          <h3>Total Applications</h3>
          <h2>
            {analytics?.totalApplications ?? totalApplications}
          </h2>
        </div>

        <div className="card">
          <h3>Internships</h3>
          <h2>
            {analytics?.totalInternships ?? items.length}
          </h2>
        </div>

        <div className="card">
          <h3>Offers</h3>
          <h2>{offers}</h2>
        </div>
      </div>

      {/* Platform Analytics */}
      <section className="card">
        <div className="page-header">
          <h2>Platform Analytics</h2>
          <p>
            Monthly trends and application status distribution
            from your database.
          </p>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadAnalytics}
            disabled={loadingAnalytics}
          >
            {loadingAnalytics ? 'Loading...' : 'Refresh Analytics'}
          </button>
        </div>

        {loadingAnalytics ? (
          <p>Loading analytics...</p>
        ) : !analytics ? (
          <div>
            <p>
              Analytics could not be loaded. Check that your
              backend analytics API is running.
            </p>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadAnalytics}
            >
              Retry Analytics
            </button>
          </div>
        ) : (
          <div className="form-grid">
            {/* Student Registration Chart */}
            <div className="card">
              <h3>Student Registrations by Month</h3>

              {(analytics.registrations || []).length === 0 ? (
                <p>No registration trend data yet.</p>
              ) : (
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.registrations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />

                      <Bar
                        dataKey="count"
                        name="Students"
                        fill="#6366f1"
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Application Trends Chart */}
            <div className="card">
              <h3>Applications by Month</h3>

              {(analytics.applicationTrends || []).length === 0 ? (
                <p>No application trend data yet.</p>
              ) : (
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.applicationTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />

                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Applications"
                        stroke="#0d9488"
                        strokeWidth={3}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Application Status Pie Chart */}
            <div className="card">
              <h3>Application Status Breakdown</h3>

              {(analytics.statusBreakdown || []).length === 0 ? (
                <p>No application status data yet.</p>
              ) : (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.statusBreakdown}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="45%"
                        outerRadius={85}
                        label={({ status, count }) =>
                          `${status}: ${count}`
                        }
                      >
                        {analytics.statusBreakdown.map(
                          (entry, index) => (
                            <Cell
                              key={entry.status}
                              fill={
                                CHART_COLORS[
                                  index % CHART_COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Application Management */}
      <section className="card">
        <h2>Application Management</h2>
        <p>
          Review applications and update their status and notes.
        </p>

        <div className="form-grid">
          {statusCounts.map(({ status, count }) => (
            <div className="card" key={status}>
              <strong>{status}</strong>
              <h3>{count}</h3>
            </div>
          ))}
        </div>

        <input
          type="search"
          placeholder="Search student, internship, company, or status..."
          value={applicationSearch}
          onChange={(e) => setApplicationSearch(e.target.value)}
          aria-label="Search applications"
        />

        <div className="card-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadApplications}
            disabled={loadingApplications}
          >
            {loadingApplications
              ? 'Loading...'
              : 'Refresh Applications'}
          </button>
        </div>

        {loadingApplications ? (
          <p>Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Internship</th>
                  <th>Company</th>
                  <th>Match</th>
                  <th>Status</th>
                  <th>Admin Notes</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((app) => {
                  const edit = applicationEdits[app._id] || {};

                  return (
                    <tr key={app._id}>
                      <td>
                        <strong>
                          {app.user?.name || 'Unknown'}
                        </strong>
                        <br />
                        <small>{app.user?.email || '—'}</small>
                      </td>

                      <td>
                        {app.internship?.title ||
                          'Internship unavailable'}
                      </td>

                      <td>{app.internship?.company || '—'}</td>

                      <td>{app.matchPercentage ?? 0}%</td>

                      <td>
                        <select
                          value={edit.status ?? app.status}
                          onChange={(e) =>
                            setApplicationEdits((previous) => ({
                              ...previous,
                              [app._id]: {
                                ...previous[app._id],
                                status: e.target.value,
                              },
                            }))
                          }
                          aria-label={`Status for ${
                            app.user?.name || 'student'
                          }`}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <textarea
                          rows={2}
                          placeholder="Add notes..."
                          value={edit.notes ?? app.notes ?? ''}
                          onChange={(e) =>
                            setApplicationEdits((previous) => ({
                              ...previous,
                              [app._id]: {
                                ...previous[app._id],
                                notes: e.target.value,
                              },
                            }))
                          }
                          aria-label={`Admin notes for ${
                            app.user?.name || 'student'
                          }`}
                        />
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={savingApplication === app._id}
                          onClick={() => saveApplication(app)}
                        >
                          {savingApplication === app._id
                            ? 'Saving...'
                            : 'Save'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* User Management */}
      <section className="card">
        <h2>User Management</h2>
        <p>
          View student profiles and their internship applications.
        </p>

        <input
          type="search"
          placeholder="Search by name, email, or university..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search registered students"
        />

        <div className="card-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadUsers}
            disabled={loadingUsers}
          >
            {loadingUsers ? 'Loading...' : 'Refresh Users'}
          </button>
        </div>

        {loadingUsers ? (
          <p>Loading registered students...</p>
        ) : filteredUsers.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>University</th>
                  <th>Target Role</th>
                  <th>Skills</th>
                  <th>Applications</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <React.Fragment key={user._id}>
                    <tr>
                      <td>
                        <strong>{user.name}</strong>
                        <br />
                        <small>{user.email}</small>
                      </td>

                      <td>
                        {user.university || 'Not provided'}
                        <br />
                        <small>{user.degree || ''}</small>
                      </td>

                      <td>{user.targetRole || 'Not specified'}</td>

                      <td>
                        {(user.skills || []).length
                          ? user.skills.join(', ')
                          : 'No skills added'}
                      </td>

                      <td>{(user.applications || []).length}</td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() =>
                            setExpandedUser(
                              expandedUser === user._id
                                ? null
                                : user._id
                            )
                          }
                        >
                          {expandedUser === user._id
                            ? 'Hide Details'
                            : 'View Details'}
                        </button>
                      </td>
                    </tr>

                    {expandedUser === user._id && (
                      <tr>
                        <td colSpan={6}>
                          <h3>{user.name}'s Profile</h3>

                          <p>
                            <strong>Email:</strong> {user.email}
                          </p>

                          <p>
                            <strong>Degree:</strong>{' '}
                            {user.degree || 'Not provided'}
                          </p>

                          <p>
                            <strong>Target Role:</strong>{' '}
                            {user.targetRole || 'Not specified'}
                          </p>

                          <p>
                            <strong>Registered:</strong>{' '}
                            {user.createdAt
                              ? new Date(
                                  user.createdAt
                                ).toLocaleDateString()
                              : 'Unknown'}
                          </p>

                          <h3>Internship Applications</h3>

                          {(user.applications || []).length === 0 ? (
                            <p>
                              This student has not applied to any
                              internships.
                            </p>
                          ) : (
                            <div className="table-responsive">
                              <table className="app-table">
                                <thead>
                                  <tr>
                                    <th>Internship</th>
                                    <th>Company</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Match</th>
                                    <th>Applied On</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {user.applications.map((app) => (
                                    <tr key={app._id}>
                                      <td>
                                        {app.internship?.title ||
                                          'Internship unavailable'}
                                      </td>

                                      <td>
                                        {app.internship?.company || '—'}
                                      </td>

                                      <td>
                                        {app.internship?.location || '—'}
                                      </td>

                                      <td>{app.status}</td>

                                      <td>
                                        {app.matchPercentage ?? 0}%
                                      </td>

                                      <td>
                                        {app.appliedAt
                                          ? new Date(
                                              app.appliedAt
                                            ).toLocaleDateString()
                                          : '—'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Internship Management */}
      <div className="page-header">
        <h2>Manage Internships</h2>
        <p>Create, edit, and remove listings.</p>
      </div>

      <form className="card" onSubmit={submit}>
        <h3>{editingId ? 'Edit Internship' : 'New Internship'}</h3>

        <div className="form-grid">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={onChange}
            required
          />

          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={onChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={onChange}
          />

          <select
            name="workMode"
            value={form.workMode}
            onChange={onChange}
          >
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </select>

          <input
            name="stipend"
            placeholder="Stipend"
            value={form.stipend}
            onChange={onChange}
          />

          <input
            name="duration"
            placeholder="Duration"
            value={form.duration}
            onChange={onChange}
          />
        </div>

        <input
          name="requiredSkills"
          placeholder="Required skills (comma separated)"
          value={form.requiredSkills}
          onChange={onChange}
        />

        <textarea
          name="description"
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={onChange}
        />

        <div className="card-actions">
          <button className="btn btn-primary" type="submit">
            {editingId ? 'Update' : 'Create'}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* All Internship Listings */}
      <div className="card">
        <h3>All Listings ({items.length})</h3>

        <div className="table-responsive">
          <table className="app-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Mode</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((internship) => (
                <tr key={internship._id}>
                  <td>
                    <strong>{internship.title}</strong>
                  </td>

                  <td>{internship.company}</td>

                  <td>{internship.workMode}</td>

                  <td className="row-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => edit(internship)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => remove(internship._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}