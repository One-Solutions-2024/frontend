import React, { useState } from 'react';
import './youtube.css';

// List of video IDs from your provided links
const videoList = [
  { id: 'i2vWsNjoFto', title: '4 Exciting Job Updates : Mitsogo, Stripe, Wipro and Cognizant are Hiring | One Solutions' },
  { id: 'yavE6elZ-6E', title: '4 Exciting Job Updates : Capgemini, Simplotel, Genpact and Zebra are Hiring | One Solutions' },
  { id: 'xcGc6mTkWMY', title: 'SQL CRUD Operations Mostly used in SQL Developers' },
  { id: 'W2ku9WMjph8', title: '5 Exciting Job Updates : Cognizant, Amazon, Razor, IntelliWorkz & EY are Hiring | One Solutions' },
  { id: '4eBNGRxkLmI', title: 'INFOANE Company Interview Process For Freshers' },
  { id: 'NWDCUwbsGSM', title: 'Python " Loops " Basic interview questions and with answers for freshers' },
];

function YouTubeVideos() {
  const [featuredVideo, setFeaturedVideo] = useState(videoList[0]); // Set the first video as the featured one

  const handleVideoClick = (video) => {
    setFeaturedVideo(video); // Update the featured video when a side video is clicked
  };

  return (
    <div className="youtube-container">
      {/* Featured Video Section */}
      <div className="featured-section">
        {featuredVideo && (
          <div className="featured-video">
            <iframe
              src={`https://www.youtube.com/embed/${featuredVideo.id}?autoplay=1`} // Autoplay when the video is updated
              title={featuredVideo.title}
              allow='autoplay'
              allowFullScreen
              className="youtube-featured-video"
            ></iframe>
          </div>
        )}
      </div>

      {/* Other Videos Section */}
      <div className="video-list">
        {videoList.map((video) => (
          <div
            key={video.id}
            className={`video-card ${featuredVideo && featuredVideo.id === video.id ? 'active' : ''}`}
            onClick={() => handleVideoClick(video)}
          >
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} // remove branding
              className="youtube-video"
            />
            <p className='video-snippet-title-mini'>{video.title.slice(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YouTubeVideos;
