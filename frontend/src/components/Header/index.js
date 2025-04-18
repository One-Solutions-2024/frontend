import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

import './header.css';

const Header = () => {
  const [menu, setMenu] = useState("home")
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [navbarOpen, setNavbarOpen] = useState(false); // State to track navbar collapse

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Toggle navbar open/close state
  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <div>
      <header className="header">
        <h1 className="header-title">ONE SOLUTIONS</h1>
      </header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <a className="navbar-brand navbar-logo" href="/">
          <img
            src={assets.company_logo}
            alt="logo"
            width="50"
            height="50"
            className="navbar-image"
          />
          <span className="company-name">One Solutions</span>
        </a>


        {/* Navbar Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar} // Call the toggle function when clicked
          aria-controls="navbarNavAltMarkup"
          aria-expanded={navbarOpen} // Reflect the state of the navbar
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler">

            {/* Only show one icon based on navbar state */}
            {navbarOpen ? (
              <i className="fas fa-times"></i> // X icon when navbar is open
            ) : (
              <i className="fas fa-bars"></i> // Hamburger icon when navbar is closed
            )}
          </span>

        </button>

        {/* Navbar links */}
        <div className={`collapse navbar-collapse ${navbarOpen ? 'show' : ''}`} id="navbarNavAltMarkup">
          <div className="navbar-nav ml-auto">
            <div className="time-display">
              <span>{currentTime}</span>
            </div>
            <a href="https://www.youtube.com/@OneSolutionsEkam" target="_blank" rel="noopener noreferrer">
              <img src={assets.YouTube_Logo} alt="YouTube" className="youtube-logo" />
            </a>
            <a className="button-whatsapp" href="https://whatsapp.com/channel/0029VaoOmU93gvWdCy0dmr3z" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp header-whatsapp"></i>Whatsapp
            </a>

            <a className="nav-link" href="/" id="navItem2">
              <li onClick={() => setMenu("Home")} className={menu === "home" ? "active" : ""}>
                Home
              </li>
            </a>

            <Link className="nav-link" id="navItem2" to="https://one-solutions.onrender.com/">
              <li onClick={() => setMenu("one-solutions-website")} className={menu === "one-solutions-website" ? "active" : ""}>
                One Solutions Website
              </li>
            </Link>
            <Link className="nav-link" id="navItem3" to="/contact">
              <li onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>
                CONTACT
              </li>
            </Link>
            <Link className="nav-link" id="navItem4" to="/JobList#follow-us-section">
              <li onClick={() => setMenu("follow-us")} className={menu === "follow-us" ? "active" : ""}>
                FOLLOW US
              </li>
            </Link>

          </div>
        </div>
      </nav>
    </div>

  );
};

export default Header;
