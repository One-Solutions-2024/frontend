import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import JobList from './JobList';
import NotFound from './components/NotFound';
import Header from './components/Header';
import Company from './components/Company';
import Contact from './components/Contact';
import BackToTop from './components/BackToTop';
import ScrollToTop from './utils/ScrollToTop';
import Popup from "./components/PopUp"; // Adjust the path as needed
import Disclaimer from './components/Disclaimer';
import Privacy from './components/PrivacyPolicy';
import AnalysisResultPage from "./components/ResumeMatch";
import Chatbot from './components/ChatBot/Chatbot'; // Add this import

import "./App.css";

const App = () => (
  <BrowserRouter>
    <Popup />
    <Header />
    <ScrollToTop />
    <Chatbot /> {/* Add this line */}
    <Routes>
      <Route path="/company/:companyname/:url" element={<Company />} /> {/* Using company name slug */}
      <Route path="/analysis-result" element={<AnalysisResultPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<Privacy />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/" element={<JobList />} />
      <Route path="/JobList" element={<JobList />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
    <BackToTop />

  </BrowserRouter>
);

export default App;
