import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from "./components/Footer";
import YouTubeVideos from './components/Youtube';
import './JobList.css';

function JobList() {
  const [allJobs, setAllJobs] = useState([]); // Store all jobs
  const [newJobs, setNewJobs] = useState([]); // Store new jobs (first 4)
  const [regularJobs, setRegularJobs] = useState([]); // Store normal jobs (remaining jobs)

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wikiSearchResults, setWikiSearchResults] = useState([]);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Detect online status

  const navigate = useNavigate();
  const location = useLocation();

  const jobsPerPage = 8;

  // Fetch all jobs from the API
  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://backend-dvwo.onrender.com/api/jobs?limit=100`);
      const data = await response.json();

      if (response.ok) {
        setAllJobs(data);

        // Set the first 4 jobs as "New Jobs"
        setNewJobs(data.slice(0, 4));

        // Set the remaining jobs as "Regular Jobs"
        setRegularJobs(data.slice(4)); // Adjusted to take all jobs after the first four

        setTotalPages(Math.ceil(data.length / jobsPerPage));
      } else {
        setAllJobs([]);
        setNewJobs([]);
        setRegularJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setAllJobs([]);
      setNewJobs([]);
      setRegularJobs([]);
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

  // Filter jobs based on search query
  useEffect(() => {
    const filteredJobs = allJobs.filter(job =>
      job.companyname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Exclude new jobs from regular jobs to avoid duplication
    const availableRegularJobs = filteredJobs.filter(job => !newJobs.includes(job));

    // Pagination logic for regular jobs
    const startIdx = (currentPage - 1) * jobsPerPage;
    const endIdx = startIdx + jobsPerPage;

    // Set regular jobs to include filtered results
    setRegularJobs(availableRegularJobs.slice(startIdx, endIdx));
    setTotalPages(Math.ceil(availableRegularJobs.length / jobsPerPage));
  }, [searchQuery, currentPage, allJobs, newJobs]);

  const handleCardClick = (job) => {
    const companyNameSlug = job.companyname.replace(/\s+/g, '-').toLowerCase();
    navigate(`/company/${companyNameSlug}`, { state: { job } });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Wikipedia search functionality
  const searchWikipedia = async (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      setWikiLoading(true);
      setWikiSearchResults([]); // Clear previous results

      const url = `https://apis.ccbp.in/wiki-search?search=${encodeURIComponent(searchQuery)}`;
      const options = { method: 'GET' };

      try {
        const response = await fetch(url, options);
        const jsonData = await response.json();
        setWikiSearchResults(jsonData.search_results);
      } catch (error) {
        console.error('Error fetching Wikipedia search results:', error);
      } finally {
        setWikiLoading(false);
      }
    }
  };

  const renderSearchResults = () => {
    if (searchQuery.trim() && wikiSearchResults.length === 0 && !wikiLoading) {
      return (
        <div className='no-message-container'>
          <div className="no-results-message">Please press "Enter" to search</div>
        </div>
      );
    }

    return wikiSearchResults.map((result, index) => (
      <div key={index} className="result-item">
        <a href={result.link} target="_blank" rel="noopener noreferrer" className="result-title">{result.title}</a>
        <br />
        <a href={result.link} target="_blank" rel="noopener noreferrer" className="result-url">{result.link}</a>
        <p className="link-description">{result.description}</p>
      </div>
    ));
  };

  // Function to pause the scrolling animation
  const handlePauseAnimation = (event) => {
    const scrollingContainer = event.currentTarget.closest('.job-rows'); // Adjust selector if necessary
    if (scrollingContainer) {
      scrollingContainer.style.animationPlayState = 'paused';
    }
  };

  // Function to resume the scrolling animation
  const handleResumeAnimation = (event) => {
    const scrollingContainer = event.currentTarget.closest('.job-rows'); // Adjust selector if necessary
    if (scrollingContainer) {
      scrollingContainer.style.animationPlayState = 'running';
    }
  };

  // Determine the heading based on search results and available jobs
  const heading = searchQuery.trim() === '' || regularJobs.length > 0 ? "Opportunities..." : "Search Results...";

  return (
    !isOnline ? (
      <div className="offline-banner">
        <h1 className='offline-heading'>You're Offline</h1>
      </div>
    ) : (
      <div className='app-container'>
        <div className='banner-container' id='home'>
          <div className='search-bar searchbar-small'>
            <div className="circle rotating">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
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
              id="searchInput"
              placeholder='Ask ONE AI or Search'
              className='search-input search-bar-section'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={searchWikipedia} // Trigger Wikipedia search on Enter
            />
          </div>

          <div className='device-top'>
            <img className="banner-image" src='https://naukrisafar.com/wp-content/uploads/2024/01/Job_hunt.png' alt="Job Hunt Banner" />
            <div className='bigdevice-top-right'>
              <h1 className='banner-name'>One Solutions: Your Trusted Career Companion</h1>
              <p className='banner-description'>Where Students can find Jobs, Technologies Videos & Many More</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='loader-div'>
            <p className="loader">Loading...</p>
          </div>
        ) : (
          <div>
            <div className='new-jobs'>
              <div className='trending-name-container'>
                <h1 className="side-headings trending-heading-left">Trending</h1>
                <div className='side-headings trending-heading-right'>
                  <div className='scrolling-container'>
                    <div className='new-jobs-list'>
                      {newJobs.map((job, index) => (
                        <div key={index} className='new-job-item' onClick={() => handleCardClick(job)}
                        >
                          <span className='company-name'>{job.companyname.toUpperCase()}:</span>
                          <span className='job-title'>{job.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


              </div>
              <div className='job-rows'>
                {/* First row (up-row) */}
                <div className='job-row up-row'>
                  {newJobs.map((job, index) => {
                    if (index % 2 === 0) {
                      return (
                        <div
                          key={job.id}
                          className='job-card-newjob'
                          onMouseEnter={(e) => handlePauseAnimation(e)}
                          onMouseLeave={(e) => handleResumeAnimation(e)}
                          onClick={() => handleCardClick(job)} // Ensure card click is handled
                        >
                          <div>
                            <img src={job.image_link} alt={job.title} className='job-image-newjob' />
                          </div>
                          <div className='job-content'>
                            <h1 className='company-card-name-new-job'>{job.companyname.slice(0, 10).toUpperCase()}</h1>
                            <h2 className='job-title-newjob'>{job.title.slice(0, 16)}...</h2>
                            <p className='job-description-new-job'>{job.description.slice(0, 30)}...</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Second row (down-row) */}
                <div className='job-row down-row'>
                  {newJobs.map((job, index) => {
                    if (index % 2 !== 0) {
                      return (
                        <div
                          key={job.id}
                          className='job-card-newjob'
                          onMouseEnter={(e) => handlePauseAnimation(e)}
                          onMouseLeave={(e) => handleResumeAnimation(e)}
                          onClick={() => handleCardClick(job)} // Ensure card click is handled
                        >
                          <div>
                            <img src={job.image_link} alt={job.title} className='job-image-newjob' />
                          </div>
                          <div className='job-content'>
                            <h1 className='company-card-name-new-job'>{job.companyname.slice(0, 10).toUpperCase()}</h1>
                            <h2 className='job-title-newjob'>{job.title.slice(0, 16)}...</h2>
                            <p className='job-description-new-job'>{job.description.slice(0, 30)}...</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
            <div className='job-list-and-youtube'>
              <h1 className="side-headings">{heading}</h1>
              <div className='job-list'>
                {searchQuery.trim() && regularJobs.length === 0 ? (
                  <div>No Jobs found for your search.</div>
                ) : (
                  regularJobs.length > 0 && regularJobs.map((job) => (
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
                  ))
                )}

                {/* Render Wikipedia results even if jobs are available */}
                {searchQuery.trim() && !wikiLoading && (
                  <div className={`main-container ${searchQuery.trim() ? 'expanded' : ''}`}>
                    {wikiLoading ? (
                      <div className="loader-div">
                        <p className="loader">Loading...</p>
                      </div>
                    ) : (
                      <div className={`search-results ${regularJobs.length > 0 ? 'has-jobs' : ''}`}>
                        <div className='search-results-container'>
                          <h2 className='search-results-heading'>Search results</h2>
                        </div>
                        {renderSearchResults()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className='pagination'>
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
        )}
        <h1 className="side-headings">Latest: Uploaded Videos...</h1>
        <YouTubeVideos />
        <a className="back-to-top" href="#home" aria-label="Back to Top">Back To Top</a>
        <Footer />
      </div>
    )
  );
}

export default JobList;
