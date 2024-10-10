import React, { useState, useEffect } from 'react';
const CountVisits = () => {
  const [visitorCount, setVisitorCount] = useState(() => {
    const storedCount = localStorage.getItem('visitorCount');
    return storedCount ? parseInt(storedCount) : 0;
  });

  useEffect(() => {
    const newCount = visitorCount + 1;
    setVisitorCount(newCount);
    localStorage.setItem('visitorCount', newCount);
  }, []); // Empty dependency array to run only once when the component mounts

  return <p className='visitoreye'><i class="fa-regular fa-eye"></i>{visitorCount}</p>;
};

export default CountVisits;
