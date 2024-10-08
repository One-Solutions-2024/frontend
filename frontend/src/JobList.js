import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from "./components/Footer"
import YouTubeVideos from './components/Youtube';

import './JobList.css';

function JobList() {
  const [allJobs, setAllJobs] = useState([]); // Store all jobs
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const navigate = useNavigate();

  const jobsPerPage = 9;
  const location = useLocation(); // Access current location to check for hash


  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backend-dvwo.onrender.com/api/jobs?limit=100'); // Fetch all jobs
      const data = await response.json();

      if (response.ok) {
        setAllJobs(data); // Set the full dataset
        setJobs(data.slice(0, jobsPerPage)); // Set the initial page's jobs
        setTotalPages(Math.ceil(data.length / jobsPerPage)); // Calculate total pages
      } else {
        setAllJobs([]);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setAllJobs([]);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs(); // Fetch all jobs when the component mounts
  }, []);

  useEffect(() => {
    // Scroll to section if there's a hash in the URL
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1)); // Get the element by ID, remove the `#` from the hash
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' }); // Scroll to the element smoothly
      }
    }
  }, [location]); // Run this effect whenever the location changes

  // Handle search and paginate filtered jobs
  useEffect(() => {
    const filteredJobs = allJobs.filter(job =>
      job.companyname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) // Add title and description to search
    );

    const startIdx = (currentPage - 1) * jobsPerPage;
    const endIdx = startIdx + jobsPerPage;
    setJobs(filteredJobs.slice(startIdx, endIdx)); // Show the current page's filtered jobs
    setTotalPages(Math.ceil(filteredJobs.length / jobsPerPage)); // Update total pages based on search results
  }, [searchQuery, currentPage, allJobs]);

  const handleCardClick = (job) => {
    const companyNameSlug = job.companyname.replace(/\s+/g, '-').toLowerCase();
    navigate(`/details/${companyNameSlug}`, { state: { job, jobs } });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Update page number
  };


  return (
    <div className='app-container'>
      <div className='banner-container' id='home'>
        <div className='search-bar search-input searchbar-small'>
          <i className="fas fa-search search-icon"></i> {/* Font Awesome search icon */}
          <input
            type='search'
            placeholder='Search'
            className='search-input search-bar-section'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <img className="banner-image" src='https://naukrisafar.com/wp-content/uploads/2024/01/Job_hunt.png' />
        <div>
          <h1 className='banner-name'>One Solutions : Your Trusted Career Companion</h1>
          <p className='banner-description'>Where Students can find Jobs, Technologies Videos & Many More</p>
          <div className='search-bar search-input searchbar-big'>
            <i className="fas fa-search search-icon"></i> {/* Font Awesome search icon */}
            <input
              type='search'
              placeholder='Search'
              className='search-input search-bar-section'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className='loader-div'>
          <p className="loader"></p>
        </div>
      ) : jobs.length > 0 ? (
        <div className='job-list-and-youtube'>
          <h1 className="side-headings">Latest Opportunity...</h1>
          <div className='job-list'>
            {jobs.map((job) => (
              <div
                key={job.id}
                className='job-card'
                onClick={() => handleCardClick(job)}
              >
                <h1 className='company-card-name'>{job.companyname}</h1>
                <h2>{job.title}</h2>
                <img
                  src={job.image_link}
                  alt={job.title}
                  className='job-image'
                />
                <p className='job-description'>{job.description.slice(0, 50)}...</p>
              </div>
            ))}
            <div className='pagination'>
              <div>
                {[...Array(totalPages).keys()].map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-button ${currentPage === pageNum + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum + 1)} // +1 because pageNum is zero-indexed
                  >
                    {pageNum + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <h1 className="side-headings">Latest: Uploaded Videos...</h1>
          <div className='youtube-videos'>
            <div className='side-youtube-videos'>
                <YouTubeVideos />
             </div>
          </div>
        </div>
      ) : (
        <p>No jobs available</p>
      )}
      <a className="back-to-top" href="#home" aria-label="Back to Top">Back To Top</a>

      <Footer />
    </div>
  );
}

export default JobList;
