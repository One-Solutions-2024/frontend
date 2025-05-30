"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { assets } from "../../assets/assets"
import Footer from "../Footer"
import { FaEye } from "react-icons/fa"
import SendIcon from "@mui/icons-material/Send"
import RecentJobPostings from "../RecentPosts"
import DOMPurify from 'dompurify'

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

  // Resume upload modal and analysis loading
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [applicationData, setApplicationData] = useState({ name: "", email: "", phone: "" })
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false)

  // Helper — Build sanitized HTML for a list of items
  const makePlainHTML = (items) => {
    return items
      .filter(i => i)
      .map(i => DOMPurify.sanitize(i))
      .join('<br/>');
  }

  // Helper — Parse JSON advanced_data or fall back to raw text
  const makeAdvancedHTML = raw => {
    try {
      const data = JSON.parse(raw)
      const entries = Object.entries(data)
        .map(
          ([k, v]) =>
            `<li><strong>${DOMPurify.sanitize(k)}:</strong> ${DOMPurify.sanitize(String(v))}</li>`
        )
        .join('')
      return `<ul class="advanced-data-list">${entries}</ul>`
    } catch {
      return `<pre class="advanced-data-text">${DOMPurify.sanitize(raw)}</pre>`
    }
  }

  // Fetch and increment view count
  const fetchViewCount = useCallback(async id => {
    try {
      const res = await fetch(`https://backend-lt9m.onrender.com/api/jobs/${id}/viewers`)
      const data = await res.json()
      setViewCount(data.viewer_count)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const incrementViewCount = useCallback(async id => {
    try {
      await fetch(`https://backend-lt9m.onrender.com/api/jobs/${id}/view`, { method: "POST" })
      fetchViewCount(id)
    } catch (err) {
      console.error(err)
    }
  }, [fetchViewCount])

  // Fetch job data
  const fetchJob = useCallback(async () => {
    if (!companyname || !url) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://backend-lt9m.onrender.com/api/jobs/company/${companyname}/${url}`
      )
      if (!res.ok) throw new Error("Failed to fetch job data")
      const data = await res.json()
      setJob(data)
      setClickCount(data.click_count || 0)
      document.title = `${data.companyname?.toUpperCase()} - ${data.title?.toUpperCase()}`
      formatAndSetDate(data.createdat)
      incrementViewCount(data.id)
    } catch (err) {
      console.error(err)
      setJob({})
    } finally {
      setLoading(false)
    }
  }, [companyname, url, incrementViewCount])

  // Uploaded resume handler with analysis
  const handleResumeUpload = async e => {
    e.preventDefault()
    if (!resumeFile) return
    setIsAnalysisLoading(true)
    const formData = new FormData()
    formData.append("resume", resumeFile)
    formData.append("name", applicationData.name)
    formData.append("email", applicationData.email)
    formData.append("phone", applicationData.phone)

    try {
      const res = await fetch(
        `https://backend-lt9m.onrender.com/api/jobs/${job.id}/upload-resume`,
        { method: "POST", body: formData }
      )
      const result = await res.json()
      if (res.ok) {
        navigate("/analysis-result", {
          state: {
            analysisResult: result,
            applyLink: job.apply_link,
            jobTitle: job.title,
            companyName: job.companyname,
            jobDescription: job.description,
          },
        })
      }
    } catch (err) {
      console.error(err)
      setIsAnalysisLoading(false)
    }
  }

  // Comments fetch & submit
  useEffect(() => {
    if (job.id) {
      (async () => {
        try {
          const res = await fetch(
            `https://backend-lt9m.onrender.com/api/comments/${job.id}`
          )
          const data = await res.json()
          setComments(data)
        } catch (err) {
          console.error(err)
        }
      })()
    }
  }, [job.id])

  const handleCommentSubmit = async e => {
    e.preventDefault()
    if (!newComment.name.trim() || !newComment.text.trim()) return
    try {
      const res = await fetch(
        "https://backend-lt9m.onrender.com/api/comments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            job_id: job.id,
            user_name: newComment.name,
            comment_text: newComment.text,
          }),
        }
      )
      if (res.ok) {
        setNewComment({ name: "", text: "" })
        const refreshed = await fetch(
          `https://backend-lt9m.onrender.com/api/comments/${job.id}`
        )
        setComments(await refreshed.json())
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Utility: capitalize words
  const capitalizeWords = str =>
    str
      ?.toLowerCase()
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

  // Format date based on screen size
  const formatAndSetDate = iso => {
    if (!iso) return
    const isSmall = window.innerWidth <= 768
    const opts = { month: isSmall ? "short" : "long", day: "numeric", year: "numeric" }
    setFormattedDate(new Date(iso).toLocaleDateString("en-US", opts))
  }

  // Handle apply click count
  const handleApplyClick = async () => {
    try {
      const res = await fetch(
        `https://backend-lt9m.onrender.com/api/jobs/${job.id}/click`,
        { method: "POST" }
      )
      const data = await res.json()
      setClickCount(data.click_count)
    } catch (err) {
      console.error(err)
    }
  }

  // Initial fetches & resize listener
  useEffect(() => {
    if (companyname && url) fetchJob()
    window.addEventListener("resize", () => formatAndSetDate(job.createdat))
    return () => window.removeEventListener("resize", () => { })
  }, [companyname, url, job.createdat, fetchJob])

  // While loading
  if (loading) return <div className="loader-div-company"><p className="loader">Loading...</p></div>

  // Prepare description points
  const descriptionPoints = job.description
    ? job.description.split("\n").map(p => p.trim())
    : []

  // Avatar color generator
  const getAvatarColor = name => {
    const colors = ["#FFB74D", "#4DB6AC", "#7986CB", "#81C784", "#64B5F6", "#BA68C8"]
    const hash = name.split("").reduce((acc, c) => c.charCodeAt(0) + (acc << 5) - acc, 0)
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <>
      <div className="details-page-container">
        <div className="current-job-container">
          <div className="right-and-left-side">
            <div className="image-and-apply-link-heading left-side">
              <div className="image-small-device">
                <div className="job-uploader-container">
                  <img
                    src={assets.image_avatar || "/placeholder.svg"}
                    alt="Job Uploader Icon"
                    className="image-icon"
                  />
                  <h1 className="job-uploader-details">
                    By <strong className="job-uploader-name">{job.job_uploader}</strong> {formattedDate}
                    <span className="view-count">
                      <FaEye className="eye-icon" /> {viewCount}
                    </span>
                  </h1>
                </div>
                <img src={job.image_link} alt={job.companyname} className="job-image-details" />
                <h2 className="heading">
                  {job.companyname?.toUpperCase()}: <span className="heading-details">{capitalizeWords(job.title)}</span>
                </h2>
              </div>
            </div>
            <div className="details-side-right-of-image">
              <p className="click-count">* Over {clickCount} People clicked to Apply</p>
              {/* Job metadata */}
              {[["Batch", job.batch], ["Salary", job.salary], ["Job Type", job.job_type], ["Experience", job.experience], ["Location", job.location]].map(([label, val]) => (
                <p key={label} className="box-type-rows"><span className="job-details-names">{label}: </span>{val}</p>
              ))}
              <div className="apply-link-container">
                <button className="image-apply-link" onClick={async () => { await handleApplyClick(); setShowUploadModal(true); }}>
                  Continue application {<SendIcon />}
                </button>
              </div>
              {/* Resume modal */}
              {showUploadModal && (
                <div className="resume-modal"><div className="modal-content">
                  <h2>Upload Resume for {job.companyname}</h2>
                  <form onSubmit={handleResumeUpload}>
                    <input type="text" placeholder="Full Name" required onChange={e => setApplicationData({ ...applicationData, name: e.target.value })} />
                    <input type="email" placeholder="Email" required onChange={e => setApplicationData({ ...applicationData, email: e.target.value })} />
                    <input type="tel" placeholder="Phone (optional)" onChange={e => setApplicationData({ ...applicationData, phone: e.target.value })} />
                    <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" required className="resume-input" onChange={e => setResumeFile(e.target.files?.[0] || null)} />
                    <label htmlFor="resume-upload" className="resume-label">{resumeFile ? resumeFile.name : "Upload Your CV"}</label>
                    {isAnalysisLoading ? (
                      <div className="analysis-loading"><p>Analyzing your resume...</p><div className="spinner" /></div>
                    ) : (
                      <div className="modal-buttons"><button type="button" onClick={() => setShowUploadModal(false)}>Cancel</button><button type="submit">Continue application</button></div>
                    )}
                  </form>
                </div></div>
              )}
            </div>
          </div>
          <hr />
          <div className="details-side">
            <h3 className="qualifications">Qualifications:</h3>
            <div className={`advanced-descriptions-con ${job.advanced_data ? 'has-advanced-data' : ''}`}>
              <div className="descriptions-column">
                <div className="descriptions-details-side" dangerouslySetInnerHTML={{
                  __html: makePlainHTML(descriptionPoints)
                }} />
              </div>
              {job.advanced_data && (
                <div className="advanced-data-column"><div className="advanced-data-section">
                  <h4 className="qualifications-advanced-name">Additional Details:</h4>
                  <div className="descriptions-details-side" dangerouslySetInnerHTML={{ __html: makeAdvancedHTML(job.advanced_data) }} />
                </div></div>
              )}
            </div>
            <hr />
            <div className="comments-section">
              <h3>Comments <span className="comments-length-num">{comments.length}</span></h3>
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <input type="text" placeholder="Your name" value={newComment.name} onChange={e => setNewComment({ ...newComment, name: e.target.value })} required />
                <input type="text" placeholder="Add a comment..." value={newComment.text} onChange={e => setNewComment({ ...newComment, text: e.target.value })} required />
                <button type="submit">Comment</button>
              </form>
              <div className="comments-list">{comments.map(comment => (
                <div key={comment.id} className="comment"><div className="comment-header">
                  <div className="comment-avatar" style={{ backgroundColor: getAvatarColor(comment.user_name) }}>{comment.user_name[0]?.toUpperCase()}</div>
                  <div><strong className="commenter-name">{comment.user_name}</strong><span>{new Date(comment.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span><p>{comment.comment_text}</p></div>
                </div></div>
              ))}</div>
            </div>
          </div>
          <RecentJobPostings />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Company
