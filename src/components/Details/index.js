import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';

const Details = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { job, jobs } = location.state || {}; // Retrieve the passed job data and list of jobs

  // Log the data to ensure you're receiving it
  console.log("Current Job:", job);
  console.log("All Jobs:", jobs);

  if (!job) {
    return <p>Coming Soon!</p>; // Handle the case where no job data is passed
  }

  // Find the index of the current job and the next job
  const currentIndex = jobs?.findIndex((j) => j.id === job.id);
  const nextJob = jobs && currentIndex !== -1 ? jobs[(currentIndex + 1) % jobs.length] : null;

  const descriptionPoints = job.description.split(',').map((point) => point.trim());

  return (
    <div className="details-page-container">
      {/* Current Job Details */}
      <div className="current-job-container">
        <div className='right-and-left-side'>
          <div className='image-and-apply-link-heaidng left-side'>
            <div className='image-small-device'>
              <img
                src={job.image_link} // Ensure job object has an image_link
                alt={job.title}
                className='job-image-details'
              />
              <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className='image-apply-link'>Apply</a>
            </div>
            <div>
              <h2 className="heading">Position: <span className="heading-details">{job.title}</span></h2>
              <hr /> {/* Horizontal line between current job details and next job */}
            </div>
          </div>
          <div className='right-side'>
            {/* Next Job Preview in Small Box */}
            {nextJob && (
              <div className="next-job-box">
                <h4>{nextJob.title}</h4>
                <img
                  src={nextJob.image_link}
                  alt={nextJob.title}
                  className='job-image-next'
                />
                <p className='next-job-description'>{nextJob.description.slice(0, 100)}...</p> {/* Display part of the description */}
                <button
                  className='next-job-link'
                  onClick={() => navigate(`/details/${nextJob.id}`, { state: { job: nextJob, jobs } })}
                >
                  View Latest Job
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='details-side'>
          <h3 className="qualifications">Qualifications:</h3>
          <ul className='descriptions-details-side'>
            {descriptionPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className='apply-link'>Apply Here</a>
          <hr /> {/* Horizontal line between current job details and next job */}
          <h3 className='follow-us'>Follow Us</h3>
          <div className='follow-section'>
            <a href="https://www.instagram.com/onesolutionsekam" target='_blank' rel='noopener noreferrer' className='follows-link'>Instagram</a>
            <a href="https://www.youtube.com/@OneSolutionsEkam" target='_blank' rel='noopener noreferrer' className='follows-link'>YouTube</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
