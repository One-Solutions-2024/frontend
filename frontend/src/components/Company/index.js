"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { assets } from "../../assets/assets"
import Footer from "../Footer"
import { FaEye } from "react-icons/fa"
import SendIcon from "@mui/icons-material/Send"
import RecentJobPostings from "../RecentPosts"
import "./index.css"

const Company = () => {
  const { companyname, url } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState({})
  const [loading, setLoading] = useState(true)
  const [formattedDate, setFormattedDate] = useState("")
  const [viewCount, setViewCount] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ name: "", text: "" })

  // State for resume upload modal and analysis loading
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false) // new state for analysis loading

  // Upload Handler
  const handleResumeUpload = async (e) => {
    e.preventDefault()
    setIsAnalysisLoading(true) // start loading

    // Reset any previous analysis result if needed

    const formData = new FormData()
    formData.append("resume", resumeFile)
    formData.append("name", applicationData.name)
    formData.append("email", applicationData.email)
    formData.append("phone", applicationData.phone)

    try {
      const response = await fetch(`https://backend-lt9m.onrender.com/api/jobs/${job.id}/upload-resume`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        // Pass both the analysis result, job description, and the job's apply link in state
        navigate("/analysis-result", {
          state: {
            analysisResult: result,
            applyLink: job.apply_link,
            jobTitle: job.title,
            companyName: job.companyname,
            jobDescription: job.description, // Pass the job description for comparison
          },
        })
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setIsAnalysisLoading(false) // stop loading on error
    }
  }

  // Fetch comments when job is loaded
  useEffect(() => {
    if (job.id) {
      fetchComments(job.id)
    }
  }, [job.id])

  const fetchComments = async (jobId) => {
    try {
      const response = await fetch(`https://backend-lt9m.onrender.com/api/comments/${jobId}`)
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.name.trim() || !newComment.text.trim()) return

    try {
      const response = await fetch("https://backend-lt9m.onrender.com/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: job.id,
          user_name: newComment.name,
          comment_text: newComment.text,
        }),
      })

      if (response.ok) {
        setNewComment({ name: "", text: "" })
        fetchComments(job.id)
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    }
  }

  // Function to capitalize words
  const capitalizeWords = (str) => {
    if (!str) return ""
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Function to format date based on screen size
  const formatAndSetDate = (createdAt) => {
    if (createdAt) {
      const isSmallScreen = window.innerWidth <= 768
      const options = {
        month: isSmallScreen ? "short" : "long",
        day: "numeric",
        year: "numeric",
      }
      const formattedDate = new Date(createdAt).toLocaleDateString("en-US", options)
      setFormattedDate(formattedDate)
    }
  }

  

  const fetchViewCount = useCallback(async (id) => {
    try {
      const response = await fetch(`https://backend-lt9m.onrender.com/api/jobs/${id}/viewers`)
      const data = await response.json()
      setViewCount(data.viewer_count)
    } catch (error) {
      console.error("Failed to fetch view count:", error.message)
    }
  }, [])

  const incrementViewCount = useCallback(async (id) => {
    try {
      await fetch(`https://backend-lt9m.onrender.com/api/jobs/${id}/view`, {
        method: "POST",
      })
      fetchViewCount(id)
    } catch (error) {
      console.error("Failed to increment job view count:", error.message)
    }
  }, [fetchViewCount])

  // Fetch job data
  const fetchJob = useCallback(async () => {
    if (!companyname || !url) {
      console.error("Missing company name or URL")
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`https://backend-lt9m.onrender.com/api/jobs/company/${companyname}/${url}`)
      if (!response.ok) {
        throw new Error("Failed to fetch company data")
      }
      const data = await response.json()
      setJob(data)
      setClickCount(data.click_count || 0)
      document.title = `${data.companyname?.toUpperCase()} - ${data.title?.toUpperCase()}`
      formatAndSetDate(data.createdat)
      incrementViewCount(data.id)
    } catch (error) {
      console.error("Error fetching job:", error)
      setJob({})
    } finally {
      setLoading(false)
    }
  }, [companyname, url, incrementViewCount])

  const handleApplyClick = async () => {
    try {
      const response = await fetch(`https://backend-lt9m.onrender.com/api/jobs/${job.id}/click`, { method: "POST" })
      const data = await response.json()
      setClickCount(data.click_count)
    } catch (error) {
      console.error("Failed to record click:", error)
    }
  }

  

  useEffect(() => {
    if (job._id) {
      incrementViewCount(job._id)
      fetchViewCount(job._id)
    }
  }, [job._id, incrementViewCount, fetchViewCount])

  useEffect(() => {
    if (companyname && url) fetchJob()
    const handleResize = () => formatAndSetDate(job.createdat)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [companyname, url, job.createdat, fetchJob])

  if (loading) {
    return (
      <div className="loader-div-company">
        <p className="loader">Loading...</p>
      </div>
    )
  }

  const descriptionPoints = job.description ? job.description.split("\n").map((point) => point.trim()) : []

  const getAvatarColor = (name) => {
    const colors = ["#FFB74D", "#4DB6AC", "#7986CB", "#81C784", "#64B5F6", "#BA68C8"]
    const hash = name.split("").reduce((acc, char) => char.charCodeAt(0) + (acc << 5) - acc, 0)
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div>
      <div className="details-page-container">
        <div className="current-job-container">
          <div className="right-and-left-side">
            <div className="image-and-apply-link-heading left-side">
              <div className="image-small-device">
                <div className="job-uploader-container">
                  <img src={assets.image_avatar || "/placeholder.svg"} className="image-icon" alt="Job Uploader Icon" />
                  <h1 className="job-uploader-details">
                    By <strong className="job-uploader-name">{job.job_uploader}</strong> {formattedDate}
                    <span className="view-count">
                      <FaEye className="eye-icon" /> {viewCount}
                    </span>
                  </h1>
                </div>
                <img src={`${job.image_link}`} alt={`${job.companyname}`} className="job-image-details" />
                <h2 className="heading">
                  {job.companyname?.toUpperCase()}:{" "}
                  <span className="heading-details">{capitalizeWords(job.title)}</span>
                </h2>
              </div>
            </div>
            <div className="details-side-right-of-image">
              <p className="click-count">* Over {clickCount} People clicked to Apply</p>
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
                <button
                  className="image-apply-link"
                  onClick={async () => {
                    await handleApplyClick()
                    setShowUploadModal(true)
                  }}
                >
                  Continue application {<SendIcon />}
                </button>
              </div>

              {showUploadModal && (
                <div className="resume-modal">
                  <div className="modal-content">
                    <h2>Upload Resume for {job.companyname}</h2>
                    <form onSubmit={handleResumeUpload}>
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                      />
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                      />
                      <input
                        id="resume-upload"
                        className="resume-input"
                        type="file"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                      />
                      <label htmlFor="resume-upload" className="resume-label">
                        {resumeFile ? resumeFile.name : "Upload Your CV"}
                      </label>
                      {/* Display a loading indicator if analysis is in progress */}
                      {isAnalysisLoading ? (
                        <div className="analysis-loading">
                          <p>Analyzing your resume...</p>
                          <div className="spinner"></div>
                        </div>
                      ) : (
                        <div className="modal-buttons">
                          <button type="button" onClick={() => setShowUploadModal(false)}>
                            Cancel
                          </button>
                          <button type="submit">Continue application</button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr />
          <div className="details-side">
            <h3 className="qualifications">Qualifications:</h3>
            <ul className="descriptions-details-side">
              {descriptionPoints.map((point, index) => point && <li key={index}>{point}</li>)}
            </ul>
            <hr />
            <div className="comments-section">
              <h3>Comments <span className="comments-length-num">{comments.length}</span></h3>
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
                            day: "numeric",
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
          <RecentJobPostings />

        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Company
