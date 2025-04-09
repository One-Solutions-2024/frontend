import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import Footer from "../Footer";
import { FaEye } from "react-icons/fa";
import SendIcon from '@mui/icons-material/Send';
import "./index.css";

const Company = () => {
  const { companyname, url } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: "",
    text: ""
  });

  // Fetch comments when job is loaded
  useEffect(() => {
    if (job.id) {
      fetchComments(job.id);
    }
  }, [job.id]);

  const fetchComments = async (jobId) => {
    try {
      const response = await fetch(
        `https://backend-lt9m.onrender.com/api/comments/${jobId}`
      );
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.text.trim()) return;

    try {
      const response = await fetch("https://backend-lt9m.onrender.com/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: job.id,
          user_name: newComment.name,
          comment_text: newComment.text
        }),
      });

      if (response.ok) {
        setNewComment({ name: "", text: "" });
        fetchComments(job.id);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  // Function to capitalize words
  const capitalizeWords = (str) => {
    if (!str) return ""; // Handle undefined or null
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Function to format date based on screen size
  const formatAndSetDate = (createdAt) => {
    if (createdAt) {
      const isSmallScreen = window.innerWidth <= 768;
      const options = {
        month: isSmallScreen ? "short" : "long",
        day: "numeric",
        year: "numeric",
      };
      const formattedDate = new Date(createdAt).toLocaleDateString("en-US", options);
      setFormattedDate(formattedDate);
    }
  };

  // Fetch job data
  const fetchJob = async () => {
    if (!companyname || !url) {
      console.error("Missing company name or URL");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://backend-lt9m.onrender.com/api/jobs/company/${companyname}/${url}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch company data");
      }
      const data = await response.json();
      setJob(data);
      setClickCount(data.click_count || 0); // Set click count from backend
      document.title = `${data.companyname?.toUpperCase()} - ${data.title?.toUpperCase()}`;
      formatAndSetDate(data.createdat);
      incrementViewCount(data.id); // Increment view count
    } catch (error) {
      console.error("Error fetching job:", error);
      setJob({});
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = async () => {
    try {
      const response = await fetch(
        `https://backend-lt9m.onrender.com/api/jobs/${job.id}/click`,
        { method: "POST" }
      );
      const data = await response.json();
      setClickCount(data.click_count); // Update click count from response
    } catch (error) {
      console.error("Failed to record click:", error);
    }

    // Open apply link in new tab
    window.open(job.apply_link, '_blank', 'noopener,noreferrer');
  };


  const incrementViewCount = async (id) => {
    try {
      await fetch(`https://backend-lt9m.onrender.com/api/jobs/${id}/view`, {
        method: "POST",
      });
      fetchViewCount(id); // Fetch updated viewer count after recording view
    } catch (error) {
      console.error("Failed to increment job view count:", error.message);
    }
  };

  const fetchViewCount = async (id) => {
    try {
      const response = await fetch(`https://backend-lt9m.onrender.com/api/jobs/${id}/viewers`);
      const data = await response.json();
      setViewCount(data.viewer_count); // Update the state with the unique viewer count
    } catch (error) {
      console.error("Failed to fetch view count:", error.message);
    }
  };

  useEffect(() => {
    if (job._id) {
      incrementViewCount(job._id);
      fetchViewCount(job._id);
    }
  }, [job._id]);



  useEffect(() => {
    if (companyname && url) {
      fetchJob();
    } else {
      console.error("Missing company name or job URL");
    }

    // Handle window resize for dynamic date formatting
    const handleResize = () => formatAndSetDate(job.createdat);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [companyname, url, job.createdat]);

  if (loading) {
    return (
      <div className="loader-div-company">
        <p className="loader">Loading...</p>
      </div>
    );
  }

  // Update the description splitting in the detailed view
  const descriptionPoints = job.description
    ? job.description.split('\n').map((point) => point.trim())
    : [];
  const getAvatarColor = (name) => {
    // Array of allowed colors (excluding white and pink variants)
    const colors = [
      '#FFB74D', // orange
      '#4DB6AC', // teal
      '#7986CB', // indigo
      '#81C784', // green
      '#64B5F6', // blue
      '#BA68C8'  // purple
    ];

    // Create simple hash from username
    const hash = name.split('').reduce((acc, char) =>
      char.charCodeAt(0) + (acc << 5) - acc, 0);

    return colors[Math.abs(hash) % colors.length];
  };
  return (
    <div>
      <div className="details-page-container">
        <div className="current-job-container">
          <div className="right-and-left-side">
            <div className="image-and-apply-link-heading left-side">
              <div className="image-small-device">
                <div className="job-uploader-container">
                  <img
                    src={assets.image_avatar}
                    className="image-icon"
                    alt="Job Uploader Icon"
                  />
                  <h1 className="job-uploader-details">
                    By <strong className="job-uploader-name">{job.job_uploader}</strong>{" "}
                    {formattedDate}
                    <span className="view-count">
                      <FaEye className="eye-icon" /> {viewCount}
                    </span>
                  </h1>
                </div>
                <img
                  src={`${job.image_link}`}
                  alt={`${job.companyname}`}
                  className="job-image-details"
                />
                <h2 className="heading">
                  {job.companyname?.toUpperCase()}:{" "}
                  <span className="heading-details">{capitalizeWords(job.title)}</span>
                </h2>
              </div>
            </div>
            <div className="details-side-right-of-image">
              <p className='click-count'>* Over {clickCount} People clicked to Apply</p>

              <p className="box-type-rows">
                <span className="job-details-names">Batch: </span>
                {job.batch}
              </p>
              <p className="box-type-rows">
                <span className="job-details-names">Salary: </span>
                {job.salary}
              </p>
              <p className="box-type-rows">
                <span className="job-details-names">Job Type: </span>
                {job.job_type}
              </p>
              <p className="box-type-rows">
                <span className="job-details-names">Experience: </span>
                {job.experience}
              </p>
              <p className="box-type-rows">
                <span className="job-details-names">Location: </span>
                {job.location}
              </p>
              <div className="apply-link-container">
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="image-apply-link"
                  onClick={handleApplyClick}
                >
                  APPLY {<SendIcon />}
                </a>
              </div>
            </div>
          </div>
          <hr />
          <div className="details-side">
            <h3 className="qualifications">Qualifications:</h3>
            <ul className="descriptions-details-side">
              {descriptionPoints.map((point, index) => (
                point && <li key={index}>{point}</li>
              ))}
            </ul>
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="apply-link"
              onClick={handleApplyClick}
            >
              Apply Here
            </a>
            <hr />
            <div className="comments-section">
              <h3>Comments {comments.length}</h3>

              <form onSubmit={handleCommentSubmit} className="comment-form">
                <input
                  type="text"
                  placeholder="Your name"
                  value={newComment.name}
                  onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  required
                />
                <button type="submit">Comment</button>
              </form>

              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <div className="comment-avatar" style={{ backgroundColor: getAvatarColor(comment.user_name) }}>
                        {comment.user_name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <strong className="commenter-name">{comment.user_name}</strong>
                        <span>
                          {new Date(comment.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                        <p>{comment.comment_text}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Company;
