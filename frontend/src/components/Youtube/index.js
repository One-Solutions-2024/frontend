import React, { useEffect, useState, useRef } from 'react';
import './youtube.css';

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY; // Use an environment variable
const channelId = 'UCgDyn1xVI2K0lLgT2hXSdAQ';

function YouTubeVideos() {
  const [videos, setVideos] = useState([]);
  const videoIdsSet = useRef(new Set());
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async (pageToken = '') => {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&order=date&part=snippet&type=video&maxResults=50&pageToken=${pageToken}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        console.warn('No videos found');
        setLoading(false);
        return;
      }

      const videoIds = data.items.map(item => item.id.videoId);
      const filteredIds = videoIds.filter(id => !videoIdsSet.current.has(id));
      filteredIds.forEach(id => videoIdsSet.current.add(id));

      const videoDetails = await fetchVideoDetails(filteredIds);
      setVideos(prevVideos => [...prevVideos, ...videoDetails]);

      if (!featuredVideo && videoDetails.length > 0) {
        setFeaturedVideo(videoDetails[0]);
      }

      if (data.nextPageToken) {
        await fetchVideos(data.nextPageToken);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to fetch videos. Please try again later.');
      setLoading(false);
    }
  };

  const fetchVideoDetails = async (videoIds) => {
    if (!videoIds.length) return [];

    const url = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds.join(',')}&part=contentDetails,snippet`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data.items) {
        console.warn('No video details found');
        return [];
      }

      const longVideos = data.items.filter(item => {
        const duration = item.contentDetails.duration;
        const durationInSeconds = parseISO8601Duration(duration);
        return durationInSeconds > 60;
      });

      return longVideos;
    } catch (error) {
      console.error('Error fetching video details:', error);
      setError('Failed to fetch video details.');
      return [];
    }
  };

  const parseISO8601Duration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    setFeaturedVideo(video);
  };

  return (
    <div className="youtube-videos">
      {loading && <p>Loading videos...</p>}
      {error && <div className="error-message">{error}</div>}

      {/* Featured Video Section */}
      {featuredVideo && (
        <div className="featured-video">
          <iframe
            src={`https://www.youtube.com/embed/${featuredVideo.id}?`}
            title={featuredVideo.snippet.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="youtube-featured-video"
          ></iframe>
        </div>
      )}

      {/* Other Videos Section */}
      <div className="video-list" style={{ overflowY: 'scroll', height: '400px' }}>
        {videos.map((video) => (
          <div 
            key={video.id} 
            className={`video-card ${featuredVideo && featuredVideo.id === video.id ? 'active' : ''}`} 
            onClick={() => handleVideoClick(video)}
          >
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?`}
              title={video.snippet.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="youtube-video"
            ></iframe>
            <p className='video-snippet-title-mini'>{video.snippet.title.slice(0, 90)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YouTubeVideos;
