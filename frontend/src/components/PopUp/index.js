import React, { useEffect, useState } from "react";
import "./popup.css"; // Import CSS for styling

const Popup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    // Fetch popup content from the backend
    const fetchPopupContent = async () => {
      try {
        const response = await fetch("https://backend-vtwx.onrender.com/api/popup");
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
        <button className="popup-close" onClick={handleClose}>
          &times;
        </button>
        <h2 className="popup-heading">{popupContent.popup.popup_heading}</h2>
        <p>{popupContent.popup.popup_text}</p>
        {popupContent.popup.popup_link && (
          <img src={popupContent.popup.popup_link} alt="Popup content" />
        )}
        <a className="below-text" href={popupContent.popup.popup_routing_link} target="_blank">{popupContent.popup.popup_belowtext}</a>
      </div>
    </div>
  );
};

export default Popup;