import React from 'react';
import Marquee from "react-fast-marquee";
import './index.css'; // Add styles if needed

function NewJobs({ newJobs, handleCardClick, capitalizeWords, searchQuery }) {
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
            {/* Stable job container only shows if there are filtered jobs */}
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
                            direction="right"
                        >
                            {newJobs.map((job, index) => (
                                index % 2 === 0 ? (
                                    <div className="skill--box"
                                        key={job.id}
                                        onClick={() => handleCardClick(job)} // Ensure card click is handled
                                    >
                                        <div>
                                            <img src={job.image_link} alt={job.title} className='job-image-newjob' />
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
                            direction="left"
                        >
                            {newJobs.map((job, index) => (
                                index % 2 !== 0 ? (
                                    <div className="skill--box"
                                        key={job.id}
                                        onClick={() => handleCardClick(job)} // Ensure card click is handled
                                    >
                                        <div>
                                            <img src={job.image_link} alt={job.title} className='job-image-newjob' />
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
                // Show scrolling job containers if no filtered jobs


                <div className="stable-job-container">
                    {filteredNewJobs.map((job) => (
                        <div className="skill--box"
                            key={job.id}
                            onClick={() => handleCardClick(job)} // Ensure card click is handled
                        >
                            <div>
                                <img src={job.image_link} alt={job.title} className='job-image-newjob' />
                            </div>
                            <div className='job-content'>
                                <h1 className='company-card-name-new-job'>{job.companyname.slice(0, 10).toUpperCase()}</h1>
                                <h2 className='job-title-newjob'>{capitalizeWords(job.title.slice(0, 16))}...</h2>
                                <p className='job-description-newjob'>{capitalizeWords(job.description.slice(0, 30))}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NewJobs;
