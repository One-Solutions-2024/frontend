import { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from "./components/Footer";
import YouTubeVideos from './components/Youtube';
import NewJobs from './components/NewJobs';
import RunningJobs from './components/RunningJobs';
import { assets } from './assets/assets';
import OJB from './components/OJB/index.js';
import './JobList.css';

function JobList() {
  const [allJobs, setAllJobs] = useState([]);
  const [newJobs, setNewJobs] = useState([]);
  const [regularJobs, setRegularJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wikiSearchResults, setWikiSearchResults] = useState([]);
  const [wikiLoading, setWikiLoading] = useState(false);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const navigate = useNavigate();
  const location = useLocation();
  const jobsPerPage = 8;
  const backend_url = "https://backend-lt9m.onrender.com";

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  // Sync URL with search state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('search') || '');
    setCurrentPage(Number(params.get('page')) || 1);
  }, [location.search]);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (currentPage > 1) params.set('page', currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [searchQuery, currentPage, navigate]);

  // Fetch jobs from API with debounced search
  const fetchAllJobs = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${backend_url}/api/jobs?search=${encodeURIComponent(debouncedSearchQuery)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setAllJobs(data);
        setNewJobs(data.slice(0, 6));
      } else {
        setAllJobs([]);
        setNewJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setAllJobs([]);
      setNewJobs([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery]);

  // Trigger fetch when debounced search changes
  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  // Handle pagination
  useEffect(() => {
    const remainingJobs = allJobs.slice(6);
    const startIdx = (currentPage - 1) * jobsPerPage;
    const endIdx = startIdx + jobsPerPage;
    setRegularJobs(remainingJobs.slice(startIdx, endIdx));
    setTotalPages(Math.ceil(remainingJobs.length / jobsPerPage));
  }, [allJobs, currentPage, jobsPerPage]);

  // Online/offline detection
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

  const handleCardClick = (job) => {
    const companyNameSlug = job.companyname
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    const jobUrlEncoded = encodeURIComponent(job.url);
    navigate(`/company/${companyNameSlug}/${jobUrlEncoded}`, { state: { job } });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Wikipedia search function
  const searchWikipedia = async (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      setWikiLoading(true);
      setWikiSearchResults([]);

      try {
        const url = `https://apis.ccbp.in/wiki-search?search=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(url);
        const jsonData = await response.json();
        setWikiSearchResults(jsonData.search_results);
      } catch (error) {
        console.error('Error fetching Wikipedia results:', error);
      } finally {
        setWikiLoading(false);
      }
    }
  };

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


  // Scroll to hash in URL
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  // Trending jobs animation control
  const handlePauseTrendingJobs = () => {
    document.querySelectorAll('.new-jobs-list').forEach(container => {
      container.style.animationPlayState = 'paused';
    });
  };

  const handleResumeTrendingJobs = () => {
    document.querySelectorAll('.new-jobs-list').forEach(container => {
      container.style.animationPlayState = 'running';
    });
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

  if (!isOnline) {
    return (
      <div className="offline-banner">
        <img src={assets.offlineimage} alt="Offline" className="offline-image" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="main-loader-container">
        <div className='loader-div'>
          <p className="loader">Loading...</p>
        </div>
      </div>
    );
  }

  const capitalizeWords = (str) =>
    str.toLowerCase().split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');


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
            onKeyDown={searchWikipedia}
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
              onClick={() => document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' })}
            >
              Find Jobs
            </button>
          </div>
        </div>
      </div>

      <RunningJobs jobs={newJobs.slice(0, 4)} handleCardClick={handleCardClick} />

      <div className='new-jobs'>
        <div className='trending-name-container'>
          <h1 className="side-headings trending-heading-left">Trending</h1>
          <div
            className='side-headings trending-heading-right'
            onMouseEnter={handlePauseTrendingJobs}
            onMouseLeave={handleResumeTrendingJobs}
          >
            <div className='scrolling-container'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='new-jobs-list new-jobs-list-offset'>
                  {newJobs.map((job, index) => (
                    <div key={index} className='new-job-item' onClick={() => handleCardClick(job)}>
                      <span className='company-name'>{capitalizeWords(job.companyname)}:</span>
                      <span className='job-title'>{capitalizeWords(job.title)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <NewJobs
          newJobs={newJobs}
          handleCardClick={handleCardClick}
          capitalizeWords={capitalizeWords}
          searchQuery={searchQuery}
        />
      </div>

      <div className='job-list-and-youtube' id='jobs'>
        <h1 className="side-headings">
          {searchQuery && regularJobs.length === 0 ? "Search Results..." : "Opportunities..."}
        </h1>

        <div className='job-list'>
          {regularJobs.map(job => (
            <div key={job.id} className='job-card' onClick={() => handleCardClick(job)}>
              <div className="job-hover-info">
                <h1 className='company-card-name'>{job.companyname.slice(0, 20).toUpperCase()}</h1>
                <h2 className="hover-job-title">{capitalizeWords(job.title)}</h2>
              </div>

              <div className="job-main-content">
                <h1 className='company-card-name'>{job.companyname.slice(0, 10).toUpperCase()}</h1>
                <h2>{capitalizeWords(job.title.slice(0, 16))}...</h2>
                <img src={job.image_link} alt={job.companyname} className="job-image" />
              </div>

              <div className="job-description-hover">
                <p>{job.batch}</p>
                <p>{job.salary}</p>
                <p>{job.experience}</p>
                <p>{job.job_type}</p>
                <p>{job.location}</p>
              </div>
            </div>
          ))}

          <OJB />

          {searchQuery.trim() && !wikiLoading && (
            <div className={`main-container ${searchQuery.trim() ? 'expanded' : ''}`}>
              {wikiLoading ? (
                <div className="loader-div">
                  <p className="loader">Loading...</p>
                </div>
              ) : (
                <div className="search-results">
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
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <h1 className="side-headings">Latest: Uploaded Videos...</h1>
      <YouTubeVideos />
      <a href="#home" className="back-to-top">Back To Top</a>
      <Footer />
    </div>
  );
}

export default JobList;