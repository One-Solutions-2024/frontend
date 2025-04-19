// src/components/RecentJobPostingsChatBot.js
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecentJobPostingsChatBot.css';

const RecentJobPostingsChatBot = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await axios.get('https://backend-lt9m.onrender.com/api/jobs?limit=4');
        setRecentJobs(response.data);
      } catch (error) {
        console.error('Error fetching recent jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentJobs();
  }, []);

  if (loading) return <div className="rjpcb-loading">Loading jobs…</div>;

  return (
    <div className="rjpcb-section">
      <h3 className="rjpcb-title">Job Suggestions</h3>
      <div className="rjpcb-grid">
        {recentJobs.map(job => (
          <Link
            key={job.id}
            to={`/company/${encodeURIComponent(job.companyname)}/${encodeURIComponent(job.url)}`}
            className="rjpcb-card"
          >
            <div className="rjpcb-card-content">
              <p className="rjpcb-company">{job.companyname}</p>
              <p className="rjpcb-job-title">{job.title}</p>
              <div className="rjpcb-meta">
                <span className="rjpcb-location">{job.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentJobPostingsChatBot;
