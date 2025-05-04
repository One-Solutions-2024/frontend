"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import DOMPurify from 'dompurify';

import "./index.css"

const AnalysisResultPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(true) // Start expanded by default
  const [matchDetails, setMatchDetails] = useState({
    pros: [],
    cons: [],
    summary: "",
  })

  // Destructure analysisResult and applyLink from state
  const { analysisResult, applyLink, jobTitle, companyName } = state || {}

  // Process job requirements and resume skills on component mount
  useEffect(() => {
    let requirements = []
    let skills = []
    let pros = []
    let cons = []
    let summary = ""

    if (state?.jobDescription) {
      // Extract job requirements from job description
      requirements = extractRequirements(state.jobDescription)

      // Get resume skills from analysis result
      skills = analysisResult.skills || []

      // Compare requirements and skills to generate pros and cons
      const comparison = compareRequirementsAndSkills(requirements, skills)
      pros = comparison.pros
      cons = comparison.cons
      summary = comparison.summary
    }

    setMatchDetails({ pros, cons, summary })
  }, [state, analysisResult])

  // If there's no analysis result or applyLink, show loading or handle missing data
  if (!analysisResult || !applyLink) {
    return (
      <div className="ar-loading-container">
        <p>Loading analysis result...</p>
      </div>
    )
  }

  // Extract filename from the resume file
  const fileName = analysisResult.resumeFileName || "YourResume.pdf"

  // Toggle expanded view
  const toggleExpanded = () => {
    setExpanded(!expanded)
  }



  // Function to extract requirements from job description
  const extractRequirements = (description) => {
    if (!description) return []

    // Split description by new lines and filter out empty lines
    const lines = description.split("\n").filter((line) => line.trim().length > 0)

    // Extract requirements (assuming each line is a requirement)
    return lines.map((line) => line.trim())
  }

  // Function to compare job requirements and resume skills
  const compareRequirementsAndSkills = (requirements, skills) => {
    const pros = []
    const cons = []

    // Convert skills to lowercase for case-insensitive matching
    const lowerCaseSkills = skills.map((skill) => skill.toLowerCase())

    // Check each requirement against skills
    requirements.forEach((req) => {
      const lowerReq = req.toLowerCase()

      // Check if any skill matches this requirement
      const hasMatch = lowerCaseSkills.some(
        (skill) => lowerReq.includes(skill) || skill.includes(lowerReq.substring(0, Math.min(lowerReq.length, 10))),
      )

      if (hasMatch) {
        pros.push(`Candidate has experience with ${req}`)
      } else {
        cons.push(`Candidate lacks experience with ${req}`)
      }
    })

    // Generate additional pros based on skills not mentioned in requirements
    skills.forEach((skill) => {
      const lowerSkill = skill.toLowerCase()
      const isExtraSkill = !requirements.some((req) => req.toLowerCase().includes(lowerSkill))

      if (isExtraSkill) {
        pros.push(`Candidate has additional skill: ${skill}`)
      }
    })

    // Generate summary
    let summary = ""
    if (pros.length > cons.length) {
      summary = `The candidate matches ${pros.length} out of ${pros.length + cons.length} job requirements. The candidate has the relevant skills for this position but may need training in some specific areas.`
    } else if (pros.length < cons.length) {
      summary = `The candidate matches ${pros.length} out of ${pros.length + cons.length} job requirements. While the candidate has some relevant skills, there are significant gaps in meeting the job requirements.`
    } else {
      summary = `The candidate matches ${pros.length} out of ${pros.length + cons.length} job requirements. The candidate has a balanced profile with both strengths and areas for improvement relative to this position.`
    }

    return { pros, cons, summary }
  }

  // If no job description was provided, use the default pros and cons from the analysis result
  const displayPros =
    matchDetails.pros.length > 0
      ? matchDetails.pros
      : analysisResult.pros && analysisResult.pros.length > 0
        ? analysisResult.pros
        : [
          "The candidate is a recent B.Tech graduate (2023), aligning perfectly with the job requirement for early graduates.",
          "Strong skills in programming languages such as Python and JavaScript, as well as experience with web development frameworks (React.js), match the job's software development focus.",
        ]

  const displayCons =
    matchDetails.cons.length > 0
      ? matchDetails.cons
      : analysisResult.cons && analysisResult.cons.length > 0
        ? analysisResult.cons
        : [
          "The candidate lacks experience in specific required technologies mentioned in the job description, such as C#, Oracle, and SQL Server.",
          "The job description emphasizes the ability to work under SLA-based projects and customer interaction, while the resume does not provide evidence of experience in such environments.",
        ]

  const displaySummary =
    matchDetails.summary ||
    analysisResult.summary ||
    "While the candidate has the relevant educational background and some strong technical skills, the lack of experience with specific required technologies and customer-facing roles presents potential barriers for the job position."

  return (
    <div className="ar-analysis-result-page">
      <div className="ar-resume-match-container">
        <div className="ai-result-company-header">
          <div>
            <strong className="company-name-ai-header">Company</strong>
            <h6>{companyName}</h6>
          </div>
          <div>
            <strong className="company-name-ai-header">Role</strong>
            <h6>{jobTitle}</h6>
          </div>
        </div>
        <div className="ar-resume-match-header">

          <div className="ar-resume-match-title">


            <div className="ar-resume-match-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h2>Your Resume Match Scores:</h2>
          </div>
          <div className="ar-powered-by">
            Powered by ONE.ai
            🤖
          </div>
        </div>

        <div className="ar-resume-file-score">
          <div className="ar-resume-file-name">{fileName}</div>
          <div className="ar-match-score">
            <span
              className={`ar-score-value ${analysisResult.matchPercentage >= 70 ? "ar-good-score" : analysisResult.matchPercentage >= 50 ? "ar-average-score" : "ar-poor-score"}`}
            >
              {Math.round(analysisResult.matchPercentage)}%
            </span>
            <button className="ar-expand-button" onClick={toggleExpanded}>
              {expanded ? "▼" : "▲"}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="ar-match-details-expanded">
            <div className="ar-overall-summary">
              <h3>Overall Summary</h3>
              <p>{displaySummary}</p>
            </div>

<div className="ar-pros-cons-container">
  <div className="ar-pros-section">
    <h3>Pros</h3>
    <ul>
      {displayPros.map((pro, index) => (
        <li key={index} className="ar-pro-item">
          <span className="ar-check-icon">✓</span>
          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pro) }} />
        </li>
      ))}
    </ul>
  </div>

  <div className="ar-cons-section">
    <h3>Cons</h3>
    <ul>
      {displayCons.map((con, index) => (
        <li key={index} className="ar-con-item">
          <span className="ar-x-icon">✕</span>
          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(con) }} />
        </li>
      ))}
    </ul>
  </div>
</div>

            <div className="ar-skills-section">
              <h3>Key Skills Found:</h3>
              <div className="ar-skills-list">
                {analysisResult.skills && analysisResult.skills.length > 0 ? (
                  analysisResult.skills.map((skill, index) => (
                    <span key={index} className="ar-skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="ar-skill-tag">JavaScript</span>
                    <span className="ar-skill-tag">React.js</span>
                    <span className="ar-skill-tag">Python</span>
                    <span className="ar-skill-tag">HTML/CSS</span>
                    <span className="ar-skill-tag">Git</span>
                  </>
                )}
              </div>
            </div>

            <div className="ar-action-buttons">
              <button className="ar-apply-button" onClick={() => window.open(applyLink, "_blank")}>
                Continue to Application
              </button>
              <button className="ar-back-button" onClick={() => navigate(-1)}>
                Back to Job
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalysisResultPage
