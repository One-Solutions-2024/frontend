import React from 'react';
import Marquee from "react-fast-marquee";
import './index.css';

// Function to remove HTML tags from strings
const removeHtmlTags = (str) => {
  if (typeof str === 'string') {
    return str.replace(/<[^>]*>/g, '');
  }
  return str || '';
};

function NewJobs({ newJobs, handleCardClick, capitalizeWords, searchQuery, backend_url }) {
  const searchTerm = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';

  // Filter jobs and remove HTML tags for search
  const filteredNewJobs = newJobs.filter(job => {
    const cleanCompany = removeHtmlTags(job.companyname).toLowerCase();
    const cleanTitle = removeHtmlTags(job.title).toLowerCase();
    const cleanDescription = removeHtmlTags(job.description).toLowerCase();
    
    return (
      cleanCompany.includes(searchTerm) ||
      cleanTitle.includes(searchTerm) ||
      cleanDescription.includes(searchTerm)
    );
  });

  // Function to process text for display
  const processText = (text, maxLength) => {
    const cleaned = removeHtmlTags(text);
    const truncated = cleaned.slice(0, maxLength);
    return cleaned.length > maxLength ? `${capitalizeWords(truncated)}...` : capitalizeWords(truncated);
  };

  return (
    <div className="skills">
      {searchQuery === "" ? (
        <div className='skills-scrolls-container'>
          {/* First Marquee (left direction) */}
          <div className="skill--scroll">
            <Marquee
              gradient={false}
              speed={80}
              pauseOnHover={true}
              pauseOnClick={true}
              delay={0}
              play={true}
              direction="left"
            >
              {newJobs.map((job, index) => (
                index % 2 === 0 && (
                  <div 
                    className="skill--box"
                    key={job.id}
                    onClick={() => handleCardClick(job)}
                  >
                    <div>
                      <img
                        src={job.image_link}
                        alt={job.companyname}
                        className='job-image-newjob'
                      />
                    </div>
                    <div className='job-content'>
                      <h1 className='company-card-name-new-job'>
                        {removeHtmlTags(job.companyname).slice(0, 10).toUpperCase()}
                      </h1>
                      <h2 className='job-title-newjob'>
                        {processText(job.title, 16)}
                      </h2>
                      <p className='job-description-newjob'>
                        {processText(job.description, 30)}
                      </p>
                    </div>
                  </div>
                )
              ))}
            </Marquee>
          </div>

          {/* Second Marquee (right direction) */}
          <div className="skill--scroll">
            <Marquee
              gradient={false}
              speed={80}
              pauseOnHover={true}
              pauseOnClick={true}
              delay={0}
              play={true}
              direction="right"
            >
              {newJobs.map((job, index) => (
                index % 2 !== 0 && (
                  <div 
                    className="skill--box"
                    key={job.id}
                    onClick={() => handleCardClick(job)}
                  >
                    <div>
                      <img
                        src={job.image_link}
                        alt={job.companyname}
                        className='job-image-newjob'
                      />
                    </div>
                    <div className='job-content'>
                      <h1 className='company-card-name-new-job'>
                        {removeHtmlTags(job.companyname).slice(0, 10).toUpperCase()}
                      </h1>
                      <h2 className='job-title-newjob'>
                        {processText(job.title, 16)}
                      </h2>
                      <p className='job-description-newjob'>
                        {processText(job.description, 30)}
                      </p>
                    </div>
                  </div>
                )
              ))}
            </Marquee>
          </div>
        </div>
      ) : (
        // Stable job container when searching
        <div className="stable-job-container">
          {filteredNewJobs.length > 0 ? (
            filteredNewJobs.map((job) => (
              <div 
                className="skill--box"
                key={job.id}
                onClick={() => handleCardClick(job)}
              >
                <div className='image-new-job-container'>
                  <img
                    src={job.image_link}
                    alt={job.companyname}
                    className='job-image-newjob'
                  />
                </div>
                <div className='job-content'>
                  <h1 className='company-card-name-new-job'>
                    {removeHtmlTags(job.companyname).slice(0, 10).toUpperCase()}
                  </h1>
                  <h2 className='job-title-newjob'>
                    {processText(job.title, 16)}
                  </h2>
                  <p className='job-description-newjob'>
                    {processText(job.description, 30)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="coming-soon-message">Coming Soon! Check in Search Results</p>
          )}
        </div>
      )}
    </div>
  );
}

export default NewJobs;