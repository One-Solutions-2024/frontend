import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './header.css';

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
    <div>
      <header className="header">
        <h1 className="header-title">ONE SOLUTIONS</h1>
      </header>
      <nav class="navbar navbar-expand-lg navbar-light bg-white">

        <a class="navbar-brand navbar-logo" href="#/">
          <img
            src="https://res.cloudinary.com/dsjcty43b/image/upload/v1726237898/WhatsApp_Image_2024-09-06_at_22.30.50_85f627e1-removebg-preview_txwq3p.png"
            alt="logo"
            width="50"
            height="50"
            class="navbar-image"
          />
          <a className='company-name' href='/'>One Solutions</a>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav ml-auto">
            <div className="time-display">
              <span>{currentTime}</span>
            </div>
            <a href="https://www.youtube.com/@OneSolutionsEkam" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className='youtube-logo' />
            </a>
            <a className='button-whatsapp' href="https://whatsapp.com/channel/0029VaoOmU93gvWdCy0dmr3z" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-whatsapp header-whatsapp"></i>Whatsapp
            </a>
            <Link className="nav-link" id='navItem1' to="/">
              <li>HOME</li>
            </Link>
            <Link className="nav-link" id='navItem2' to="https://one-solutions.pages.dev/">
              <li>One Solutions Website</li>
            </Link>
            <Link className="nav-link" id='navItem3' to="/contact">
              <li>CONTACT</li>
            </Link>
            <Link className="nav-link" id='navItem4' to="/JobList#follow-us-section">
              <li>FOLLOW US</li>
            </Link></div>
        </div>
      </nav>

    </div>

  );
}

export default Header;
