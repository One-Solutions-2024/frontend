// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { assets } from '../../assets/assets';
import './JobCard.css';

const API_URL = 'https://ojbbackend.onrender.com/api';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]); // Changed to array
  const [loading, setLoading] = useState(true);


  // Inline API calls
  const getJobs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/jobs`);
      return data;
    } catch (err) {
      console.error('Error fetching jobs:', err);
      return [];
    }
  };

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const data = await getJobs();
        const now = new Date();
        const sorted = (jobs) =>
          [...jobs].sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));

        const sortedJobs = sorted(data);
        
        const recent = sortedJobs.filter(({ date_posted }) => {
          const diff = (now - new Date(date_posted)) / (1000 * 60 * 60 * 24);
          return diff < 2;
        });

        // Select first 2 jobs as featured
        const featured = recent.length >= 2 ? recent.slice(0, 2) 
          : sortedJobs.slice(0, 2);
        setFeaturedJobs(featured);

      } catch (err) {
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);


  const JobCard = ({ job }) => {
    const postDate = new Date(job.date_posted);
    const isRecent = (new Date() - postDate) / (1000 * 60 * 60 * 24) < 2;
    const capitalize = (s) => s[0]?.toUpperCase() + s.slice(1).toLowerCase();
    const href = `https://onejobsboard.onrender.com/jobs/${job.id}/${job.url}`;

    return (
     <a href={href} target="_blank" rel="noopener noreferrer" className="ojb-job-card-link">
       <div className={`ojb-job-card ${isRecent ? 'ojb-highlight' : ''}`}>
        <div className='ojb-small-device-row'>
          <div className="ojb-company-logo">
            <img
              src={job.image_link}
              alt={job.companyname}
              className="ojb-company-card-logo"
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
            />
          </div>
          <div className='ojb-small-device-title'>
            <span className='ojb-job-title'>{job.title.slice(0,25)}</span>
            <span className="ojb-company">{capitalize(job.companyname).slice(0,23)}</span>
          </div>
        </div>
        <div className='ojb-image-title-container'>
          <div className='ojb-title-company-container'>
            <span className='ojb-job-title'>{job.title.slice(0,25)}</span>
            <span className="ojb-company">{capitalize(job.companyname).slice(0,25)}</span>
          </div>
          <div className='ojb-location-salary-container'>
            <span className="ojb-location">📍{job.location.slice(0, 20)}</span>
            <span className='ojb-salary'>💰{job.salary}</span>
          </div>
          <div className="ojb-details">
            <span className="ojb-date">📅
              {new Date(job.date_posted).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
     </a>
    );
  };

  if (loading) return (
    <div className="ojb-loading">
      <div className="ojb-spinner-wrapper">
        <img src={assets.ojb_logo} className="ojb-logo-loading" alt="Loading" />
      </div>
    </div>
  );

  return (
    <div className="ojb-home-page">
      {featuredJobs.length > 0 && (
        <div className="ojb-featured-jobs-container">
          {featuredJobs.map(job => (
            <div key={job.id} className="ojb-featured-job">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Home;
