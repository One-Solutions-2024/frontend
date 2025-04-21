import React, { useState, useCallback } from "react";
import axios from "axios";
import { X } from "react-feather";
import "./ResumeUploadPopup.css";

const ResumeUploadPopup = ({ isOpen, onClose, onUploadSuccess }) => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [file, setFile]         = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = useCallback(e => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(e => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(e => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = useCallback(e => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file || !name.trim() || !email.trim()) {
      setError("Name, email and resume file are required.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);

    try {
      const { data } = await axios.post(
        "https://backend-lt9m.onrender.com/api/analyze-resume",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onUploadSuccess(data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="resume-upload-overlay">
      <div className="resume-upload-container">
        <div className="resume-upload-header">
          <h5>Upload Your Resume</h5>
          <button onClick={onClose} className="resume-upload-close">
            <X size={20} />
          </button>
        </div>
        <form className="resume-upload-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name*</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          {/* drag‑and‑drop zone */}
          <div
            className={`file-dropzone${dragActive ? " dragover" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
              <h6>📄 Resume </h6>
            {file
              ? <p>{file.name}</p>
              : <p>Drag & drop your resume here, or click to select a file</p>
            }
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            type="submit"
            className="upload-submit"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload & Analyze"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUploadPopup;
