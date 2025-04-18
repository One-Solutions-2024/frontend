import React from 'react';
import Marquee from "react-fast-marquee";
import './index.css'; // Add styles if needed

function NewJobs({ newJobs, handleCardClick, capitalizeWords, searchQuery, backend_url }) {
    // Ensure searchQuery is a string
    const searchTerm = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';

    // Filter newJobs based on the searchTerm
    const filteredNewJobs = newJobs.filter(job =>
        job.companyname.toLowerCase().includes(searchTerm) ||
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm)
    );

    return (
        <div className="skills">
            {/* Display Marquee when searchQuery is empty */}
            {searchQuery === "" ? (
                <div className='skills-scrolls-container'>
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
                                index % 2 === 0 ? (
                                    <div className="skill--box"
                                        key={job.id}
                                        onClick={() => handleCardClick(job)} // Ensure card click is handled
                                    >
                                        <div>
                                            <img
                                                src={`${job.image_link}`}
                                                alt={`${job.companyname}`}
                                                className='job-image-newjob'
                                            />
                                        </div>
                                        <div className='job-content'>
                                            <h1 className='company-card-name-new-job'>{job.companyname.slice(0, 10).toUpperCase()}</h1>
                                            <h2 className='job-title-newjob'>{capitalizeWords(job.title.slice(0, 16))}...</h2>
                                            <p className='job-description-newjob'>{capitalizeWords(job.description.slice(0, 30))}</p>
                                        </div>
                                    </div>
                                ) : null // Return null for odd indexed items
                            ))}
                        </Marquee>
                    </div>

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
                                index % 2 !== 0 ? (
                                    <div className="skill--box"
                                        key={job.id}
                                        onClick={() => handleCardClick(job)} // Ensure card click is handled
                                    >
                                        <div>
                                            <img
                                                src={`${job.image_link}`}
                                                alt={`${job.companyname}`}
                                                className='job-image-newjob' />
                                        </div>
                                        <div className='job-content'>
                                            <h1 className='company-card-name-new-job'>{job.companyname.slice(0, 10).toUpperCase()}</h1>
                                            <h2 className='job-title-newjob'>{capitalizeWords(job.title.slice(0, 16))}...</h2>
                                            <p className='job-description-newjob'>{capitalizeWords(job.description.slice(0, 30))}</p>
                                        </div>
                                    </div>
                                ) : null // Return null for even indexed items
                            ))}
                        </Marquee>
                    </div>
                </div>
            ) : (
                // Show stable job container if searchQuery is not empty
                <div className="stable-job-container">
                    {filteredNewJobs.length > 0 ? (
                        filteredNewJobs.map((job) => (
                            <div className="skill--box"
                                key={job.id}
                                onClick={() => handleCardClick(job)} // Ensure card click is handled
                            >
                                <div className='image-new-job-container'>
                                    <img
                                        src={`${job.image_link}`}
                                        alt={`${job.companyname}`}
                                        className='job-image-newjob'
                                    />
                                </div>
                                <div className='job-content'>
                                    <h1 className='company-card-name-new-job'>{job.companyname.slice(0, 10).toUpperCase()}</h1>
                                    <h2 className='job-title-newjob'>{capitalizeWords(job.title.slice(0, 16))}...</h2>
                                    <p className='job-description-newjob'>{capitalizeWords(job.description.slice(0, 30))}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="coming-soon-message">Coming Soon! Check in Search Results</p> // Message when no jobs are available

                    )}
                </div>
            )}
        </div>
    );
}

export default NewJobs;
