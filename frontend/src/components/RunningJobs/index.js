// RunningJobs.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './runningjobs.css';

const RunningJobs = ({ jobs = [], handleCardClick }) => { // Set default value for jobs
    const settings = {
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job.id} className="job-slide" 
                        onClick={() => handleCardClick(job)} // Ensure card click is handled
                        >
                            <div className='image-container'>
                                <img src={job.image_link} alt={job.title} className="job-image-runningjob" />
                            </div>
                            <h1 className='company-name-running'>{job.companyname.toUpperCase()}</h1>
                            <p>{job.title.toUpperCase()}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-jobs-message">
                        <p>No jobs available</p> {/* Display message if jobs array is empty */}
                    </div>
                )}
            </Slider>
        </div>
    );
};

export default RunningJobs;
