import { useState, useEffect } from 'react';
import "./VisitoCounter.css"
import Cookies from 'js-cookie'; // You'll need to install this via npm: npm install js-cookie

const PageViewCounter = () => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    const visitKey = 'pageview_visited';
    const isNewVisitor = !Cookies.get(visitKey); // Check if the user already has the cookie

    if (isNewVisitor) {
      // Mark the user as visited
      Cookies.set(visitKey, 'true', { expires: 365 }); // Cookie expires in 1 year

      // Count the pageview
      const trackPageview = async () => {
        try {
          const response = await fetch('https://backend-dvwo.onrender.com/track-visitor');
          const data = await response.json();
          setViews(data.uniqueViews);
        } catch (error) {
          console.error('Error fetching pageviews:', error);
        }
      };

      trackPageview();
    }
  }, []);

  return <p className='visitoreye'><i className="fa-regular fa-eye"></i>{views}</p>;
};

export default PageViewCounter;
