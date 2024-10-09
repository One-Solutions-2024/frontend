import { useState, useEffect } from 'react';
import "./VisitoCounter.css"

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Fetch visitor count from the backend
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('https://backend-dvwo.onrender.com/track-visitor'); // Change URL based on your backend
        const data = await response.json();
        setVisitorCount(data.visitorCount);
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      }
    };

    fetchVisitorCount();
  }, []);

  return <p className='visitoreye'><i class="fa-regular fa-eye"></i>{visitorCount}</p>;
};

export default VisitorCounter;
