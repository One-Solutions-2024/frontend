import { useState, useEffect } from 'react';
import "./VisitorCounter.css"

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Fetch visitor count from the backend
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('https://backend-dvwo.onrender.com/track-visitor'); // Adjust URL as needed
        const data = await response.json();
        setVisitorCount(data.visitorCount);
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      }
    };

    fetchVisitorCount();
  }, []);

  return <p className='visitoreye'><i className="fa-regular fa-eye"></i>{visitorCount}</p>;
};

export default VisitorCounter;
