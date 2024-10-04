import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            <iframe width="360" height="315" src="https://www.youtube.com/embed/W2ku9WMjph8?si=_SkSI4Ny9-1GYS6P" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className='youtube-video'></iframe>
            <iframe width="360" height="315" src="https://www.youtube.com/embed/4eBNGRxkLmI?si=YlJQONd59PBn_Y2J" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className='youtube-video'></iframe>
            <iframe width="360" height="315" src="https://www.youtube.com/embed/NWDCUwbsGSM?si=7VF9ruC2_DuUShIs" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className='youtube-video'></iframe>
          </div>
        </div>
      ) : (
        <p>No jobs available</p>
      )}
      <a className="back-to-top" href="#home" aria-label="Back to Top">Back To Top</a>

      <section id="down-logo">
        <div className="logo-websitename">
          <img className="logo"
            src="https://res.cloudinary.com/dsjcty43b/image/upload/v1726470878/WhatsApp_Image_2024-09-06_at_22.30.50_85f627e1-removebg-preview_yp7rg2.png" alt='logo' rel="noreferrer"/>
          <h1 className="heading-down">ONE SOLUTIONS</h1>
        </div>
        <section id="social">
          <div className="social-links">
            <a href="https://instagram.com/OneSolutionsEkam" target="_blank">  
              <img className="bottom-icons-instagram"
                src="https://th.bing.com/th/id/R.735dda68880a385ce8cc5be4f3c5fcd6?rik=qSxRw2lCZYy9Mw&riu=http%3a%2f%2fpngimg.com%2fuploads%2finstagram%2finstagram_PNG11.png&ehk=QVCbfkCKi8pJLF08bRkS%2fLeMqLTnJQf402WRaIdN6jE%3d&risl=&pid=ImgRaw&r=0" alt='instagram' rel="noreferrer"/>
            </a>
            <a href="https://www.linkedin.com/in/one-solutions-131947329/" target="_blank">
              <img className="bottom-icons-linkedin"
                src="https://itcnet.gr/wp-content/uploads/2020/09/Linkedin-logo-on-transparent-Background-PNG-.png" alt='linkedin' rel="noreferrer"/>
            </a>
            <a href="https://www.youtube.com/@OneSolutionsEkam" target="_blank"> 
              <img className="bottom-icons" src="https://th.bing.com/th/id/R.b800cd54a94aaecc66e8752091d26f6b?rik=ChXMqbKPu0ueGg&pid=ImgRaw&r=0" alt='youtube' rel="noreferrer"/>
            </a>
          </div>
        </section>
      </section>

      <footer>

        <div className="footer-copyright">
          <p>&copy; 2024 <a className="span-copy" href="#home">One Solutions</a>. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default JobList;
