import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobList.css';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backend-dvwo.onrender.com/api/jobs'); // Adjust the API URL if necessary
      const data = await response.json();

      if (response.ok && data.length > 0) {
        setJobs(data); // Set jobs if data is received
      } else {
        setJobs([]); // Empty jobs array if no data
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]); // Handle fetch error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCardClick = (job) => {
    // Use backticks for template literal
    navigate(`/details/${job.id}`, { state: { job, jobs } });
  };

  return (
    <div className='app-container'>
      {loading ? (
        <p className='loader'>Loading...</p> // Show loader during fetch
      ) : jobs.length > 0 ? (
        <div className='job-list'>
          {jobs.map((job) => (
            <div
              key={job.id}
              className='job-card'
              onClick={() => handleCardClick(job)} // Handle card click
            >
              {/* Add an image to the job card */}
              <h2>{job.title}</h2>
              <img 
                src={job.image_link} // Ensure job object has an image_link
                alt={job.title}
                className='job-image' 
              />                
              <p className='job-description'>{job.description.slice(0, 50)}...</p> {/* Display part of the description */}
             </div>
          ))}
        </div>
      ) : (
        <p>No jobs available</p> // Message when no jobs are available
      )}
    </div>
  );
}

export default JobList;
