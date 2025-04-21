import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Upload, X, HelpCircle, Maximize, Minimize } from "lucide-react";
import RecentJobPostingsChatBot from "./RecentBotJobPosts";
import ResumeScorePopup from "./ResumeResultPopup/resume-score-popup";
import ResumeUploadPopup from "./ResumeUploadPopup";
import "./ChatBot.css";

const detectUrls = (text) => {
  const regex = /(https?:\/\/[^\s]+)/g;
  return text.split(regex).map((part, i) =>
    regex.test(part)
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
      : part
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [resumeData, setResumeData] = useState({
    score: 0,
    skills: [],
    feedbackType: "strengths",
    feedback: [],
  });

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setMessages([
        {
          text: `Hi! I'm ONE Assistant AI. How can I help you today?\n\nYou can ask about:\n- Resume optimization\n- Interview preparation\n- Career advice\n- Job market trends`,
          isUser: false,
        },
      ]);
      setHasOpened(true);
    }
    scrollToBottom();
  }, [messages, isOpen, hasOpened]);

  const addTextMessage = (text, isUser = false) =>
    setMessages((m) => [...m, { text, isUser }]);
  const addJobsMessage = () =>
    setMessages((m) => [...m, { type: "jobs" }]);

  const handleUploadSuccess = (data) => {
    const roundedScore = Math.round(data.score || 0);
    setResumeData({
      score: roundedScore,
      skills: Array.isArray(data.skills) ? data.skills : [],
      feedbackType: roundedScore > 65 ? "strengths" : "weaknesses",
      feedback:
        roundedScore > 65
          ? [
              "Strong technical skills matching job requirements",
              "Relevant project experience",
              "Clear presentation of achievements",
            ]
          : [
              "Add more relevant keywords to improve ATS match",
              "Include measurable achievements (e.g., metrics, scores)",
              "Organize sections for clarity (Education, Experience)",
            ],
    });
    addTextMessage(`I've analyzed your resume. Your ATS Score is ${roundedScore}%`, true);
    addJobsMessage();
    setShowScorePopup(true);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    setInputMessage("");
    setIsLoading(true);
    addTextMessage(inputMessage, true);

    const jobRelated =
      inputMessage.toLowerCase().includes("job") ||
      inputMessage.toLowerCase().includes("career");
    let found = false;

    try {
      const res = await axios.post(
        "https://backend-lt9m.onrender.com/api/chatbot",
        { message: inputMessage }
      );
      if (res.data.reply?.length > 10) {
        addTextMessage(res.data.reply);
        if (jobRelated) addJobsMessage();
        found = true;
      }
    } catch (err) {
      setError(err);
    }

    // fallback web/wikipedia searches omitted for brevity
    if (!found) {
      addTextMessage("I couldn't find specific information.");
    }

    setIsLoading(false);
  };

  const examples = [
    "What skills are in demand for software engineers?",
    "How can I improve my resume for data science roles?",
    "Current job market trends",
    "Help me prepare for a technical interview",
    "Available job opportunities",
  ];

  return (
    <>
      <div className={`cb-container ${isOpen ? "open" : ""} ${isFullscreen ? "fullscreen" : ""}`}>
        <button className="cb-toggle" onClick={() => setIsOpen((o) => !o)}>
          {isOpen ? <X size={24} /> : <div className="one_ai-icon">🤖</div>}
        </button>

        <div className="cb-window">
          <div className="cb-header">
            <h3>ONE AI Assistant</h3>
            <div className="cb-header-controls">
              <button className="cb-header-button" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
              <button className="cb-header-button" onClick={() => setIsOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="cb-messages">
            {messages.map((msg, i) => {
              if (msg.type === "jobs") {
                return (
                  <div key={i} className="cb-message bot">
                    <div className="cb-bot-icon">🤖</div>
                    <div className="cb-message-content cb-recent-jobs">
                      <RecentJobPostingsChatBot />
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className={`cb-message ${msg.isUser ? "user" : "bot"}`}>
                  {!msg.isUser && <div className="cb-bot-icon">🤖</div>}
                  <div className="cb-message-content">
                    {msg.text?.split("\n").map((line, idx) => (
                      <div key={idx}>{detectUrls(line)}<br /></div>
                    ))}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="cb-message bot">
                <div className="cb-typing">
                  <span className="cb-typing-dot" />
                  <span className="cb-typing-dot" />
                  <span className="cb-typing-dot" />
                </div>
              </div>
            )}

            {showExamples && (
              <div className="cb-examples">
                {examples.map((q, i) => (
                  <button
                    key={i}
                    className="cb-example-question"
                    onClick={() => {
                      setInputMessage(q);
                      setShowExamples(false);
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="cb-input">
            <button className="cb-examples-toggle" onClick={() => setShowExamples((x) => !x)}>
              <HelpCircle size={20} />
            </button>
            <label className="cb-file-upload" onClick={() => setShowUploadPopup(true)}>
              <Upload size={20} />
            </label>
            <input
              className="cb-input-field"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message…"
            />
            <button className="cb-send-btn" onClick={handleSendMessage} disabled={isLoading}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Popup */}
      <ResumeUploadPopup
        isOpen={showUploadPopup}
        onClose={() => setShowUploadPopup(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Resume Score Popup */}
      <ResumeScorePopup
        isOpen={showScorePopup}
        onClose={() => setShowScorePopup(false)}
        score={resumeData.score}
        skills={resumeData.skills}
        feedbackType={resumeData.feedbackType}
        feedback={resumeData.feedback}
      />
    </>
  );
};

export default ChatBot;
