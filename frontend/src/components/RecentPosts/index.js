'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './index.css';

const RecentJobPostings = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await axios.get(
          'https://backend-lt9m.onrender.com/api/jobs?limit=4'
        );
        setRecentJobs(response.data);
      } catch (error) {
        console.error('Error fetching recent jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentJobs();
  }, []);

  if (loading) {
    return (
      <div className="rt-loading-jobs">
        Loading recent jobs...
      </div>
    );
  }

  return (
    <div className="rt-recent-jobs-section">
      <h3 className="rt-section-title">Recently Posted Jobs</h3>
      <div className="rt-recent-jobs-grid">
        {recentJobs.map(job => (
          <Link
            key={job.id}
            to={`/company/${encodeURIComponent(job.companyname)}/${encodeURIComponent(job.url)}`}
            className="rt-job-card"
          >
            <div className="rt-job-card-content">
              <img
                src={job.image_link}
                alt={job.companyname}
                className="rt-company-logo"
              />
              <div className="rt-job-details">
                <h4 className="rt-company-name">{job.companyname}</h4>
                <p className="rt-job-title">{job.title}</p>
                <div className="rt-job-meta">
                  <span className="rt-job-location">{job.location}</span>
                  <button className="rt-job-apply-btn">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentJobPostings;
