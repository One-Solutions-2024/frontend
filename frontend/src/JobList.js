import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from "./components/Footer";
import YouTubeVideos from './components/Youtube';
import NewJobs from './components/NewJobs'; // Import the new component
import RunningJobs from './components/RunningJobs';

import { assets } from './assets/assets';

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

  // Read initial params on mount/URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('search') || '');
    setCurrentPage(Number(params.get('page')) || 1);
  }, [location.search]);

  // Update URL when search/filter changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if(searchQuery) params.set('search', searchQuery);
    else params.delete('search');
    
    if(currentPage > 1) params.set('page', currentPage);
    else params.delete('page');

    navigate(`?${params.toString()}`, { replace: true });
  }, [searchQuery, currentPage]);

  const jobsPerPage = 8;


  const backend_url = "https://backend-lt9m.onrender.com"

  

  // Fetch all jobs from the API
  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const url = `${backend_url}/api/jobs?search=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);

      const data = await response.json();

      if (response.ok) {
        setAllJobs(data);

        // Set the first 4 jobs as "New Jobs"
        setNewJobs(data.slice(0, 6));

        // Set the remaining jobs as "Regular Jobs"
        setRegularJobs(data.slice(6)); // Adjusted to take all jobs after the first four

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
// Filter jobs based on search query
useEffect(() => {
  const filteredJobs = allJobs.filter(job =>
    job.companyname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.salary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.experience.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.job_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())

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


  // Early returns for offline and loading states
  if (!isOnline) {
    return (
      <div className="offline-banner">
        <img
          className="offline-image"
          src={assets.offlineimage}
          alt="You're Offline"
        />
      </div>
    );
  }
  if (loading) {
    return (
      <div className='loader-div'>
        <p className="loader">Loading...</p>
      </div>
    );
  }

  

  const handleCardClick = (job) => {
    // Convert company name to a URL-friendly slug (replace spaces and special characters)
    const companyNameSlug = job.companyname
      .trim()                       // Remove extra spaces from both ends
      .replace(/[^\w\s]/g, '')       // Remove any non-word characters (e.g., punctuation)
      .replace(/\s+/g, '-')          // Replace spaces with dashes
      .toLowerCase();                // Convert to lowercase

    // Encode the job's URL to make it safe for use in the navigation path
    const jobUrlEncoded = encodeURIComponent(job.url);

    // Navigate to the company-specific job page with both company slug and job URL in the path
    navigate(`/company/${companyNameSlug}/${jobUrlEncoded}`, { state: { job } });
  };

  


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };



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


  // Function to pause the scrolling animation for all trending job lists
  const handlePauseTrendingJobs = () => {
    const scrollingContainers = document.querySelectorAll('.new-jobs-list'); // Select all new-jobs-list elements
    scrollingContainers.forEach((container) => {
      container.style.animationPlayState = 'paused'; // Pause animation for each container
    });
  };

  // Function to resume the scrolling animation for all trending job lists
  const handleResumeTrendingJobs = () => {
    const scrollingContainers = document.querySelectorAll('.new-jobs-list'); // Select all new-jobs-list elements
    scrollingContainers.forEach((container) => {
      container.style.animationPlayState = 'running'; // Resume animation for each container
    });
  };

  

  function capitalizeWords(str) {
    return str
      .toLowerCase() // Make the entire string lowercase first
      .split(' ') // Split the string by spaces
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together
  }


  
  // Determine the heading based on search results and available jobs
  const heading = searchQuery.trim() === '' || regularJobs.length > 0 ? "Opportunities..." : "Search Results...";

  

  return (

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
          <img className="banner-image" src={assets.banner_image} alt="Job Hunt Banner" />
          <div className='bigdevice-top-right'>
            <h1 className='banner-name'>One Solutions: Your Trusted Career Companion</h1>
            <p className='banner-description'>Where Students can find Jobs, Technologies Videos & Many More</p>
            <button
              className="find-job-btn"
              type="button"
              onClick={() => document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' })}              >
              Find Jobs
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className='loader-div'>
          <p className="loader">Loading...</p>
        </div>
      ) : (
        <div>


          <hr />
          <RunningJobs
            handleCardClick={handleCardClick}
            jobs={newJobs.slice(0, 4)}
          />
          <hr />


          <div className='new-jobs'>
            <div className='trending-name-container'>
              <h1 className="side-headings trending-heading-left">Trending</h1>
              <div
                className='side-headings trending-heading-right'
                onMouseEnter={handlePauseTrendingJobs}  // Pause on hover
                onMouseLeave={handleResumeTrendingJobs} // Resume when hover ends
              >
                <div className='scrolling-container'>
                  <div className='new-jobs-list new-jobs-list-offset'>
                    {newJobs.map((job, index) => (
                      <div key={index} className='new-job-item' onClick={() => handleCardClick(job)}>
                        <span className='company-name'>{capitalizeWords(job.companyname)}:</span>
                        <span className='job-title'>{capitalizeWords(job.title)}</span>
                      </div>

                    ))}
                  </div>
                  <div className='new-jobs-list new-jobs-list-offset'>
                    {newJobs.map((job, index) => (
                      <div key={index} className='new-job-item' onClick={() => handleCardClick(job)}>
                        <span className='company-name'>{capitalizeWords(job.companyname)}:</span>
                        <span className='job-title'>{capitalizeWords(job.title)}</span>
                      </div>

                    ))}
                  </div>
                  <div className='new-jobs-list new-jobs-list-offset'>
                    {newJobs.map((job, index) => (
                      <div key={index} className='new-job-item' onClick={() => handleCardClick(job)}>
                        <span className='company-name'>{capitalizeWords(job.companyname)}:</span>
                        <span className='job-title'>{capitalizeWords(job.title)}</span>
                      </div>

                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* Pass newJobs as props to TrendingJobs */}

              <NewJobs
                newJobs={newJobs}
                handleCardClick={handleCardClick}
                capitalizeWords={capitalizeWords}
                searchQuery={searchQuery}
              />

              {/* Job list and YouTube logic remains the same... */}
            </div>

          </div>
          <div className='job-list-and-youtube' id='jobs'>
            <h1 className="side-headings">{heading}</h1>
            <div className='job-list'>
              {searchQuery.trim() && regularJobs.length === 0 ? (
                <div>Check Jobs In Trending...</div>
              ) : (
                regularJobs.length > 0 && regularJobs.map((job) => (
                  <div key={job.id} className='job-card col-12 col-md-6 col-lg-3' onClick={() => handleCardClick(job)}>
                    {/* Hover content (slides in from top left) */}
                    <div className="job-hover-info">
                      <h1 className='company-card-name hover-none'>{job.companyname.slice(0, 20).toUpperCase()}</h1>
                      <h2 className="hover-job-title">{capitalizeWords(job.title)}</h2>
                    </div>

                    {/* Main content of the job card */}
                    <div className="job-main-content">
                      <h1 className='company-card-name hover-none'>{job.companyname.slice(0, 10).toUpperCase()}</h1>
                      <h2 className='hover-none'>{capitalizeWords(job.title.slice(0, 16))}...</h2>
                      <img
                        src={`${job.image_link}`}
                        alt={`${job.companyname}`}
                        className="job-image"
                      />
                    </div>

                    {/* Bottom right description (slides up on hover) */}
                    <div className="job-description-hover">
                      {/* Extract and display the first point of the description */}
                      <div className="job-description-job-card">
                        <p> {job.batch} </p>
                        <p> {job.salary} </p>
                        <p> {job.experience}</p>
                        <p> {job.job_type}</p>
                        <p> {job.location}</p>
                      </div>
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
}

export default JobList;