import React, { useState } from 'react';
import './youtube.css';

// List of video IDs from your provided links
const jobsList = [
  { id: 'rsKrXeABMtI', title: '6 Exciting Job Updates: Wipro, Ags Health, Cisco, Qualcomm, Zycus and Fresh Prints | One Solutions' },
  { id: 'NaxafQ_ly58', title: '6 Exciting Job Updates : Deloite, Simens, WabTec,  EY, Motorola and HCL are Hiring | One Solutions' },
  { id: 'i2vWsNjoFto', title: '4 Exciting Job Updates : Mitsogo, Stripe, Wipro and Cognizant are Hiring | One Solutions' },
  { id: 'W2ku9WMjph8', title: '4 Exciting Job Updates : Capgemini, Simplotel, Genpact and Zebra are Hiring | One Solutions' },
  { id: 'NWDCUwbsGSM', title: '5 Exciting Job Updates : Cognizant, Amazon, Razor, IntelliWorkz & EY are Hiring | One Solutions' },
];

const technicalvideoList = [
  { id: 'N1cdFu7h7-M', title: 'Crack Technical Round in First attempt with enhance problem solving Skills. | One Solutions' },
  { id: 'nf2vLkn5SWg', title: 'Crack Technical Round in First attempt with enhance problem solving Skills. Card - 2 | One Solutions' },
  { id: 'Ldh-UxZ9Y8A', title: 'Crack Technical Round in First attempt with enhance problem solving Skills. Card - 3 | One Solutions' },
  { id: 'yavE6elZ-6E', title: 'INFOANE Company Interview Process For Freshers' },
  { id: 'xcGc6mTkWMY', title: 'Python " Loops " Basic interview questions and with answers for freshers' },
  { id: '4eBNGRxkLmI', title: 'SQL CRUD Operations Mostly used in SQL Developers' },
];

function YouTubeVideos() {
  const [videoList, setVideoList] = useState(jobsList); // Default to jobsList
  const [featuredVideo, setFeaturedVideo] = useState(videoList[0]); // Set the first video as the featured one
  const [isExpanded, setIsExpanded] = useState(false);

  const handleVideoClick = (video) => {
    setFeaturedVideo(video); // Update the featured video when a side video is clicked
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleListChange = (list) => {
    setVideoList(list);
    setFeaturedVideo(list[0]); // Update the featured video to the first in the selected list
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
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="youtube-featured-video"
            ></iframe>
          </div>
        )}
      </div>

      {/* Playlist Section */}
      <div className="playlist-videos">
        <h2 className="featured-title">{featuredVideo.title}</h2> {/* Title sticks here */}
        <div className="video-list">
          {videoList.map((video) => (
            <div
              key={video.id}
              className={`video-card ${featuredVideo && featuredVideo.id === video.id ? 'active' : ''}`}
              onClick={() => handleVideoClick(video)}
            >
              <img
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                className="youtube-video"
                alt='youtube-video'
              />
              <p className="video-snippet-title-mini">{video.title.slice(0, 100)}...</p>
            </div>
          ))}
        </div>
        <div
          className={`more-list-videos-container ${isExpanded ? 'expanded' : ''}`}
          onClick={toggleExpand}
        >
          <div className='push-pull-button'></div>
          {isExpanded && (
            <div className="expanded-content">
              <div
                className="list-option-container"
                onClick={() => handleListChange(jobsList)}
              >
                <div
                  className={`radio-button ${videoList === jobsList ? 'active' : ''
                    }`}
                ></div>
                <p className="list-option">Jobs List</p>
              </div>
              <div
                className="list-option-container"
                onClick={() => handleListChange(technicalvideoList)}
              >
                <div
                  className={`radio-button ${videoList === technicalvideoList ? 'active' : ''
                    }`}
                ></div>
                <p className="list-option">Technical Videos List</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default YouTubeVideos;
