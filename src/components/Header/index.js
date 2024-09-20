import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './index.css';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="nav-header">
      <header className="header">
        <h1 className="header-title">ONE SOLUTIONS</h1>
      </header>
      <div className="blog-container">
        <div className='logo-container'>
          <a className="navbar-logo" href="/">
            <img src="https://res.cloudinary.com/dsjcty43b/image/upload/v1726237898/WhatsApp_Image_2024-09-06_at_22.30.50_85f627e1-removebg-preview_txwq3p.png" alt="logo" width="92" height="100" /> 
          </a>
          <a className='company-name' href='/'>One Solutions</a>
        </div>

        <div className="time-display">
          <span>{currentTime}</span>
        </div>

        <ul className="nav-menu">
          <a href="https://www.youtube.com/@OneSolutionsEkam" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className='youtube-logo' />
          </a>
          <a className='button-whatsapp' href="https://whatsapp.com/channel/0029VaoOmU93gvWdCy0dmr3z" target="_blank" rel="noopener noreferrer">
            Whatsapp
          </a>

          <Link className="nav-link" to="/">
            <li>HOME</li>
          </Link>
          <Link className="nav-link" to="https://one-solutions.pages.dev/">
            <li>One Solutions Website</li>
          </Link>
          <Link className="nav-link" to="/contact">
            <li>CONTACT</li>
          </Link>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
