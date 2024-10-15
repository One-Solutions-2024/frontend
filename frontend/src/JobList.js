import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from "./components/Footer";
import YouTubeVideos from './components/Youtube';
import './JobList.css';

function JobList() {
  const [allJobs, setAllJobs] = useState([]); // Store all jobs
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const jobsPerPage = 8;

  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://backend-dvwo.onrender.com/api/jobs?limit=100`);
      const data = await response.json();

      if (response.ok) {
        setAllJobs(data);
        setJobs(data.slice(0, jobsPerPage));
        setTotalPages(Math.ceil(data.length / jobsPerPage));
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
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const [filtering, setFiltering] = useState(false);

useEffect(() => {
  setFiltering(true);
  const filteredJobs = allJobs.filter(job =>
    job.companyname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIdx = (currentPage - 1) * jobsPerPage;
  const endIdx = startIdx + jobsPerPage;
  setJobs(filteredJobs.slice(startIdx, endIdx));
  setTotalPages(Math.ceil(filteredJobs.length / jobsPerPage));
  setFiltering(false);
}, [searchQuery, currentPage, allJobs]);


  const handleCardClick = (job) => {
    const companyNameSlug = job.companyname.replace(/\s+/g, '-').toLowerCase();
    navigate(`/company/${companyNameSlug}`, { state: { job, jobs } });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className='app-container'>
      <div className='banner-container' id='home'>
        <div className='search-bar search-input searchbar-small'>
          <div className="circle rotating">
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ADEF" />
                  <stop offset="50%" stopColor="#8A2BE2" />
                  <stop offset="100%" stopColor="#FF007F" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" stroke="url(#gradient)" className="circle-gradient" />
            </svg>
          </div>
          <input
            type='search'
            placeholder='Search'
            className='search-input search-bar-section'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='device-top'>
        <img className="banner-image" src='https://naukrisafar.com/wp-content/uploads/2024/01/Job_hunt.png' alt="Job Hunt Banner" />
        <div className='bigdevice-top-right'>
          <h1 className='banner-name'>One Solutions : Your Trusted Career Companion</h1>
          <p className='banner-description'>Where Students can find Jobs, Technologies Videos & Many More</p>
          
        </div>
        </div>
      </div>

      {loading ? (
        <div className='loader-div'>
          <p className="loader">Loading...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className='job-list-and-youtube'>
          <h1 className="side-headings">Latest Opportunity...</h1>
          <div className='job-list'>
            {jobs.map((job) => (
              <div key={job.id}>
                <div
                  className='job-card col-12 col-md-6 col-lg-3'
                  onClick={() => handleCardClick(job)}
                >
                  <h1 className='company-card-name'>{job.companyname.slice(0, 10).toUpperCase()}</h1>
                  <h2>{job.title.slice(0, 16)}...</h2>
                  <img
                    src={job.image_link}
                    alt={job.title}
                    className='job-image'
                  />
                  <p className='job-description'>{job.description.slice(0, 30)}...</p>
                  <a href="#" className="menu-item-link">
                    View
                    <svg width="16px" height="16px" viewBox="0 0 16 16" className="bi bi-arrow-right" fill="#d0b200" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
            <div className='pagination'>
              <div>
                {[...Array(totalPages).keys()].map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-button ${currentPage === pageNum + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum + 1)}
                  >
                    {pageNum + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <h1 className="side-headings">Latest: Uploaded Videos...</h1>
        </div>
      ) : (
        <p>No jobs available</p>
      )}

      <YouTubeVideos />

      <a className="back-to-top" href="#home" aria-label="Back to Top">Back To Top</a>

      <Footer />
    </div>
  );
}

export default JobList;