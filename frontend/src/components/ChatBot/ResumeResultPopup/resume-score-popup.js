import React from "react";
import { X } from "lucide-react";
import "./ResumeScorePopup.css";

const ResumeScorePopup = ({ score, skills = [], feedback = [], feedbackType = "strengths", isOpen, onClose }) => {
  if (!isOpen) return null;

  const title = feedbackType === "strengths" ? "Strengths" : "Weaknesses";
  const listClass = feedbackType === "strengths" ? "strengths" : "weaknesses";

  return (
    <div className="resume-popup-overlay">
      <div className="resume-popup-container">
        <div className="resume-popup-header">
          <h2>📄 Resume Analyzer</h2>
          <button onClick={onClose} className="resume-popup-header-button">
            <X size={20} />
          </button>
        </div>

        <div className="resume-popup-body">
          <div className="resume-popup-chart">
            <svg viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
              />
            </svg>
            <div className="resume-popup-chart-text">{score}%</div>
          </div>

          <h3 className="resume-popup-title">ATS Compatibility Score</h3>
          <p className="resume-popup-subtitle">
            How well your resume matches ATS requirements
          </p>

          <div className="resume-popup-section">
            <h4 className="resume-popup-section-title">Skills Detected</h4>
            <div className="resume-popup-skills">
              {skills.map((skill, idx) => (
                <span key={idx}>{skill}</span>
              ))}
            </div>
          </div>

          <div className={`resume-popup-section resume-popup-${listClass}`}>
            <h4 className="resume-popup-section-title">{title}</h4>
            <ul>
              {feedback.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScorePopup;
