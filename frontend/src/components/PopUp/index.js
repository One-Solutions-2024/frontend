import React, { useEffect, useState } from "react";

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

  if (!showPopup || !popupContent) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="popup-close" onClick={handleClose}>
          &times;
        </button>
        <h2>{popupContent.popup_heading}</h2>
        <p>{popupContent.popup_text}</p>
        {popupContent.popup_link && (
          <img src={popupContent.popup_link} alt="Popup content" />
        )}
        <a href={popupContent.popup_routing_link}>{popupContent.popup_belowtext}</a>
      </div>
    </div>
  );
};

export default Popup;
