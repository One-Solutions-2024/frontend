import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSend, FiUpload, FiX, FiHelpCircle } from 'react-icons/fi';
import './ChatBot.css';

// Add URL detection function
const detectUrls = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
};


const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock job data (replace with actual API call)
  const jobSuggestions = [
    { title: 'Senior Software Engineer', company: 'Tech Corp', location: 'Remote' },
    { title: 'Data Analyst', company: 'Data Insights', location: 'New York' },
    { title: 'Marketing Manager', company: 'Digital Solutions', location: 'London' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setMessages(prev => [...prev, {
        text: "Hi! I'm Career Assistant AI. How can I help you today?\n\nYou can ask about:\n- Resume optimization\n- Interview preparation\n- Career advice\n- Job market trends",
        isUser: false
      }]);
      setHasOpened(true);
    }
    scrollToBottom();
  }, [messages, isOpen, hasOpened]);

  const getJobSuggestionsText = () => {
    return jobSuggestions.map((job, index) =>
      `${index + 1}. ${job.title} at ${job.company} (${job.location})`
    ).join('\n');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !file) return;
  
    const addMessage = (text, isUser = false) => {
      setMessages(prev => [...prev, { text, isUser }]);
    };
  
    if (file) {
      setMessages(prev => [...prev, { text: `Uploading ${file.name}...`, isUser: true }]);
      const formData = new FormData();
      formData.append('resume', file);
      try {
        const { data } = await axios.post(
          'https://backend-lt9m.onrender.com/api/analyze-resume',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setMessages(prev => [...prev, {
          text: `ATS Score: ${data.score}%\n\n${data.feedback}\n\nJob Suggestions:\n${getJobSuggestionsText()}`,
          isUser: false
        }]);
      } catch {
        setMessages(prev => [...prev, { text: 'Failed to analyze resume', isUser: false }]);
      }
      setFile(null);
      setInputMessage('');
      return;
    }

    addMessage(inputMessage, true);
  setInputMessage('');
  setIsLoading(true);

  let responseFound = false;
  const query = inputMessage.toLowerCase();
  const isJobRelated = query.includes('job') || query.includes('career');

  try {
    // Try Main Backend
    const mainResponse = await axios.post(
      'https://backend-lt9m.onrender.com/api/chat',
      { message: inputMessage }
    );
    
    if (mainResponse.data?.reply?.length > 10) {
      let reply = mainResponse.data.reply;
      if (isJobRelated) reply += `\n\n💼 Job Opportunities:\n${getJobSuggestionsText()}`;
      addMessage(reply);
      responseFound = true;
    }
  } catch (mainError) {
    // Proceed to fallback
  }

  if (!responseFound) {
    try {
      // Try Google Custom Search
      const searchResponse = await axios.get(
        `https://www.googleapis.com/customsearch/v1?key=AIzaSyBmudctDNy8EHElJcll4cza0joNUQOSW94&cx=1630c7eb3c2ed45a7&q=${encodeURIComponent(inputMessage)}&num=3`
      );
      
      if (searchResponse.data.items?.length > 0) {
        let reply = '🔍 Web Results:\n\n';
        searchResponse.data.items.forEach((item, index) => {
          reply += `${index + 1}. ${item.title}\n${item.snippet}\n${item.link}\n\n`;
        });
        if (isJobRelated) reply += `\n💼 Job Opportunities:\n${getJobSuggestionsText()}`;
        addMessage(reply);
        responseFound = true;
      }
    } catch (searchError) {
      // Proceed to next fallback
    }
  }

  if (!responseFound) {
    try {
      // Try Wikipedia API
      const wikiResponse = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(inputMessage)}&limit=3&format=json&origin=*`
      );
      
      if (wikiResponse.data[1]?.length > 0) {
        let reply = '📚 Wikipedia Results:\n\n';
        wikiResponse.data[1].forEach((title, index) => {
          reply += `${index + 1}. ${title}\n${wikiResponse.data[3][index]}\n\n`;
        });
        if (isJobRelated) reply += `\n💼 Job Opportunities:\n${getJobSuggestionsText()}`;
        addMessage(reply);
        responseFound = true;
      }
    } catch (wikiError) {
      // Proceed to final fallback
    }
  }

  if (!responseFound) {
    // Final Fallback
    let reply = "I couldn't find specific information, but here's what I can suggest:";
    if (isJobRelated) {
      reply += `\n\n💼 Job Opportunities:\n${getJobSuggestionsText()}`;
    }
    reply += "\n\n🔍 Try rephrasing your question";
    reply += "\n📝 Check our example questions";
    reply += "\n🌐 Search online using key terms from your question";
    addMessage(reply);
  }

  setIsLoading(false);
};

  const exampleQuestions = [
    'What skills are in demand for software engineers?',
    'How can I improve my resume for data science roles?',
    'Current job market trends',
    'Help me prepare for a technical interview',
    'Available job opportunities'
  ];

  return (
    <div className={`cb-container ${isOpen ? 'open' : ''}`}>
      <button className="cb-toggle" onClick={() => setIsOpen(o => !o)}>
        {isOpen ? <FiX /> : '🤖'}
      </button>

      <div className="cb-window">
        <div className="cb-header">
          <h3>Career Assistant AI</h3>
          <p>How can I help you today?</p>
        </div>

        <div className="cb-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`cb-message ${msg.isUser ? 'user' : 'bot'}`}>
              {!msg.isUser && <div className="cb-bot-icon">🤖</div>}
              <div className="cb-message-content">
                {msg.text.split('\n').map((line, idx) => (
                  <div key={idx}>
                    {detectUrls(line).map((element, elementIndex) => (
                      <React.Fragment key={elementIndex}>
                        {element}
                        {elementIndex === line.split(/(https?:\/\/[^\s]+)/g).length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="cb-message bot">
              <div className="cb-typing">
                <span className="cb-typing-dot" />
                <span className="cb-typing-dot" />
                <span className="cb-typing-dot" />
              </div>
            </div>
          )}

          <button className="cb-examples-toggle" onClick={() => setShowExamples(x => !x)}>
            <FiHelpCircle />
          </button>

          {showExamples && (
            <div className="cb-examples">
              {exampleQuestions.map((q, i) => (
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
          <label className="cb-file-upload">
            <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} />
            <FiUpload />
          </label>

          <input
            className="cb-input-field"
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
          />
          <button className="cb-send-btn" onClick={handleSendMessage} disabled={isLoading}>
            <FiSend />
          </button>
        </div>

        {file && (
          <div className="cb-file-preview">
            {file.name}
            <button onClick={() => setFile(null)}>×</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;