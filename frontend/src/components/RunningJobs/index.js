import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './runningjobs.css';

const RunningJobs = ({ jobs = [], handleCardClick }) => {
    const settings = {
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    };

    const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTrendingIndex((prevIndex) => (prevIndex + 1) % jobs.length);
        }, 2500); // Change job every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [jobs.length]);

    // Function to format date for each job
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = {
            month: isSmallScreen ? 'short' : 'long',
            day: 'numeric',
            year: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="slider-container">
            {/* Trending Section */}
            <div className="trending-container">
                <div className="trending-box">MONITORING NOW</div>
                <div className="trending-display">
                    {jobs.length > 0 && (
                        <p>
                            {jobs[currentTrendingIndex].companyname.toUpperCase()}: {" "}
                            <span>{jobs[currentTrendingIndex].title.toUpperCase()}</span>
                        </p>
                    )}
                </div>
            </div>
            <Slider {...settings}>
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        className="job-slide"
                        onClick={() => handleCardClick(job)} // Ensure card click is handled
                    >
                        <div className="image-container">
                            <img
                                src={`${job.image_link}`}
                                alt={`${job.companyname}`}
                                className="job-image-runningjob"
                            />
                        </div>
                        <h1 className="company-name-running">
                            {job.companyname.toUpperCase()}
                        </h1>
                        <p>{job.title.toUpperCase()}</p>
                        <h1 className="job-uploader-details">
                            <strong className="job-uploader">{job.job_uploader}</strong>{' - '}
                            {formatDate(job.createdat)}
                        </h1>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default RunningJobs;
