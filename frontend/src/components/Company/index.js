import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Footer from "../Footer";
import './index.css';

const Company = () => {
  const location = useLocation();
  const { companyname } = useParams(); // Get the company name slug from the URL
  const [job, setJob] = useState(location.state?.job || null); // Use job passed from the previous page or null
  const [loading, setLoading] = useState(!job); // Show loading if job is not already passed
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the job by company name if it's not already passed via location.state
    const fetchJobByCompanyName = async () => {
      if (!job) { // If job is not passed via state, fetch it
        setLoading(true);
        try {
          const response = await fetch(`https://one-solutions-job-notifications.onrender.com/company/${companyname}`);
          if (!response.ok) {
            throw new Error('Failed to fetch job');
          }
          const data = await response.json();
          if (data) {
            setJob(data); // Successfully fetched the job
          } else {
            setError('Job not found');
          }
        } catch (error) {
          setError('Error fetching job data');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchJobByCompanyName();
  }, [companyname, job]);

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!job) return <p>Coming Soon!</p>;

  // Split description into bullet points for display
  const descriptionPoints = job.description.split(',').map((point) => point.trim());

  return (
    <div>
      <div className="details-page-container">
        <div className="current-job-container">
          <div className="right-and-left-side">
            <div className="image-and-apply-link-heading left-side">
              <div className="image-small-device">
                <img
                  src={job.image_link}
                  alt={job.title}
                  className="job-image-details"
                />
                <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="image-apply-link">Apply</a>
              </div>
              <div>
                <h2 className="heading">{job.companyname}: <span className="heading-details">{job.title}</span></h2>
                <hr />
              </div>
            </div>
          </div>
          <div className="details-side">
            <h3 className="qualifications">Qualifications:</h3>
            <ul className="descriptions-details-side">
              {descriptionPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="apply-link">Apply Here</a>
            <hr />
            <h3 className="follow-us">Follow Us</h3>
            <div className="follow-section">
              <a href="https://www.instagram.com/onesolutionsekam" target="_blank" rel="noopener noreferrer" className="follows-link">Instagram</a>
              <a href="https://www.youtube.com/@OneSolutionsEkam" target="_blank" rel="noopener noreferrer" className="follows-link">YouTube</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Company;
