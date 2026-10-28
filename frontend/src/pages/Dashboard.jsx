import React, { useEffect, useState, useContext } from 'react';
import { applicationAPI, skillGapAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, gapRes] = await Promise.all([
        applicationAPI.getStats(),
        skillGapAPI.getOverallGap()
      ]);
      setStats(statsRes.data);
      setGapData(gapRes.data.overallAnalysis);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Loading your portfolio dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Welcome back, {user?.name || 'Student'} 👋</h2>
        <p>Track your internship applications, review skill matching, and explore target roles.</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Applications" value={stats?.stats?.totalApplications || 0} subtitle="Tracked in pipeline" icon="📄" color="indigo" />
        <StatCard title="Active Pipeline" value={stats?.stats?.activeApplications || 0} subtitle="Applied / Interviews" icon="⚡" color="amber" />
        <StatCard title="Interviews Scheduled" value={stats?.stats?.interviews || 0} subtitle="Stage reached" icon="🎤" color="green" />
        <StatCard title="Offers Received" value={stats?.stats?.offers || 0} subtitle="Successful outcomes" icon="🎉" color="purple" />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Recent Application Pipeline</h3>
          {stats?.recentApplications?.length > 0 ? (
            <div className="table-responsive">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Skill Match</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentApplications.map((app) => (
                    <tr key={app._id}>
                      <td><strong>{app.internship?.title || 'Role'}</strong></td>
                      <td>{app.internship?.company || 'Company'}</td>
                      <td><span className={`badge status-${app.status.toLowerCase()}`}>{app.status}</span></td>
                      <td><strong>{app.matchPercentage}%</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-text">No active applications tracked yet. Visit <Link to="/internships">Internships</Link> to apply!</p>
          )}
        </div>

        <div className="card">
          <h3>Skill Gap High Demand Target</h3>
          <p className="subtext">Target Role: <strong>{gapData?.userTargetRole}</strong></p>
          <div className="skill-tags">
            {gapData?.topMissingSkills?.slice(0, 5).map((item, idx) => (
              <div key={idx} className="skill-chip missing">
                <span>{item.skill}</span>
                <span className="demand-count">{item.marketDemandCount} postings require this</span>
              </div>
            ))}
          </div>
          <Link to="/skill-gap" className="btn btn-secondary mt-3">View Skill Gap Breakdown →</Link>
        </div>
      </div>
    </div>
  );
}
