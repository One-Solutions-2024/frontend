import React, { useEffect, useState } from "react";
import "./popup.css"; // Import CSS for styling

const Popup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    // Fetch popup content from the backend
    const fetchPopupContent = async () => {
      try {
        const response = await fetch("https://backend-lt9m.onrender.com/api/popup");
        if (response.ok) {
          const content = await response.json();
          console.log("Fetched content:", content); // Log content to check structure
          setPopupContent(content);
          setShowPopup(true); // Show popup after content is loaded
        }
      } catch (error) {
        console.error("Error fetching popup content:", error);
      }
    };

    fetchPopupContent();
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  // Check if popupContent has loaded and has the expected nested structure
  if (!showPopup || !popupContent?.popup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <a className="close" onClick={handleClose}><i className="fa-solid fa-x"></i></a>

        <h2 className="popup-heading">{popupContent.popup.popup_heading}</h2>
        <p>{popupContent.popup.popup_text}</p>
        <img src={`${popupContent.popup.popup_link}`} alt="Popup content" />
        <button className="callToAction" type="button">
          <a className="below-text" href={popupContent.popup.popup_routing_link} target="_blank" rel="noreferrer">{popupContent.popup.popup_belowtext}</a>
        </button>

      </div>
    </div>
  );
};

export default Popup;
