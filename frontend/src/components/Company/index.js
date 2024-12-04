import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Footer from "../Footer";
import './index.css';

const Company = () => {
  const { companyname, url } = useParams();

  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState('');

  // Function to capitalize words
  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Function to format date based on screen size
  const formatAndSetDate = (createdAt) => {
    if (createdAt) {
      const isSmallScreen = window.innerWidth <= 768;
      const options = {
        month: isSmallScreen ? 'short' : 'long',
        day: 'numeric',
        year: 'numeric',
      };
      const formattedDate = new Date(createdAt).toLocaleDateString('en-US', options);
      setFormattedDate(formattedDate);
    }
  };

  // Fetch job data
  const fetchJob = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://backend-lt9m.onrender.com/api/jobs/company/${companyname}/${url}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company data');
      }
      const data = await response.json();

      setJob(data);
      document.title = `${data.companyname?.toUpperCase()} - ${data.title?.toUpperCase()}`;
      formatAndSetDate(data.createdat);

      // Increment the view count after fetching the job
      incrementViewCount(data._id);
    } catch (error) {
      console.error('Error fetching job:', error);
      setJob({});
    } finally {
      setLoading(false);
    }
  };

  // Function to increment the view count
  const incrementViewCount = async (jobId) => {
    try {
      await fetch(`https://backend-lt9m.onrender.com/api/jobs/${jobId}/view`, { method: "POST" });
    } catch (error) {
      console.error("Failed to increment job view count:", error.message);
    }
  };

  useEffect(() => {
    fetchJob();

    // Handle window resize for dynamic date formatting
    const handleResize = () => formatAndSetDate(job.createdat);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [companyname, url, job.createdat]);

  if (loading) {
    return (
      <div className='loader-div-company'>
        <p className="loader">Loading...</p>
      </div>
    );
  }

  const descriptionPoints = job.description ? job.description.split('#').map(point => point.trim()) : [];

  return (
    <div>
      <div className="details-page-container">
        <div className="current-job-container">
          <div className='right-and-left-side'>
            <div className='image-and-apply-link-heading left-side'>
              <div className='image-small-device'>
                <div className='job-uploader-container'>
                  <img src={assets.image_avatar} className='image-icon' alt="Job Uploader Icon" />
                  <h1 className='job-uploader-details'>
                    By <strong className='job-uploader-name'>{job.job_uploader}</strong> {formattedDate}
                  </h1>
                </div>
                <img 
                  src={`${job.image}`} 
                  alt={`${job.companyname}`} 
                  className='job-image-details' 
                />
                <h2 className="heading">
                  {job.companyname?.toUpperCase()}: <span className="heading-details">{capitalizeWords(job.title)}</span>
                </h2>
              </div>
            </div>
            <div className="details-side-right-of-image">
              <p className='box-type-rows'><span className='job-details-names'>Batch: </span>{job.batch}</p>
              <p className='box-type-rows'><span className='job-details-names'>Salary: </span>{job.salary}</p>
              <p className='box-type-rows'><span className='job-details-names'>Job Type: </span>{job.job_type}</p>
              <p className='box-type-rows'><span className='job-details-names'>Experience: </span>{job.experience}</p>
              <p className='box-type-rows'><span className='job-details-names'>Location: </span>{job.location}</p>
              <div className='apply-link-container'>
                <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className='image-apply-link'>Apply</a>
              </div>
            </div>
          </div>
          <hr />
          <div className='details-side'>
            <h3 className="qualifications">Qualifications:</h3>
            <ul className='descriptions-details-side'>
              {descriptionPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
            <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className='apply-link'>Apply Here</a>
            <hr />
            <h3 className='follow-us'>Follow Us</h3>
            <div className='follow-section'>
              <a href="https://www.instagram.com/onesolutionsekam" target='_blank' rel='noopener noreferrer' className='follows-link'>Instagram</a>
              <a href="https://www.youtube.com/@OneSolutionsEkam" target='_blank' rel='noopener noreferrer' className='follows-link'>YouTube</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Company;
