import React from 'react'; // Add useContext here
import Marquee from "react-fast-marquee";



import './index.css'; // Add styles if needed

function NewJobs({ newJobs, handleCardClick, capitalizeWords }) {

    return (
        <div className="skills" >
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
                    {newJobs.map((job, index) => {
                        if (index % 2 == 0) {
                            return (
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
                            );
                        }
                    })}
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
                    {newJobs.map((job, index) => {
                        if (index % 2 !== 0) {
                            return (
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
                            );
                        }
                    })}
                </Marquee>
            </div>
        </div>
    );
}

export default NewJobs;
