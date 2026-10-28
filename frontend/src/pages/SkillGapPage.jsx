import React, { useState, useEffect } from 'react';
import { skillGapAPI } from '../services/api';

export default function SkillGapPage() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverallGap();
  }, []);

  const fetchOverallGap = async () => {
    try {
      const res = await skillGapAPI.getOverallGap();
      setAnalysis(res.data.overallAnalysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Analyzing market demand vs. your skill vector...</div>;

  return (
    <div className="skill-gap-page">
      <div className="page-header">
        <h2>Target Skill-Gap Analysis</h2>
        <p>Market recommendations based on active internship requirements.</p>
      </div>

      <div className="card">
        <h3>Algorithm Strategy</h3>
        <p className="subtext">
          Methodology: <strong>{analysis?.matchingAlgorithm}</strong> across {analysis?.totalInternshipsAnalyzed} active internship opportunities.
        </p>
      </div>

      <div className="gap-grid">
        <div className="card">
          <h3 className="text-green">✅ Owned Market Skills ({analysis?.ownedMarketSkills?.length})</h3>
          <div className="skill-tags">
            {analysis?.ownedMarketSkills?.map((s, idx) => (
              <span key={idx} className="skill-chip owned">
                {s.skill} ({s.marketDemandCount} listings)
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-amber">⚠️ Missing In-Demand Skills ({analysis?.topMissingSkills?.length})</h3>
          <div className="resources-list">
            {analysis?.topMissingSkills?.map((item, idx) => (
              <div key={idx} className="resource-card">
                <div>
                  <h4>{item.skill}</h4>
                  <p className="subtext">Required by {item.marketDemandCount} active listings</p>
                  <p className="course-name">📚 {item.resource.course} ({item.resource.duration})</p>
                </div>
                <a href={item.resource.url} target="_blank" rel="noreferrer" className="btn btn-secondary">
                  Learn Skill ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
