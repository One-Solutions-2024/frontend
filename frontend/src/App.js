import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import JobList from './JobList';
import NotFound from './components/NotFound';
import Header from './components/Header';
import Company from './components/Company';
import Contact from './components/Contact';
import "./App.css";

const App = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/company/:companyname/:url" element={<Company />} /> {/* Using company name slug */}
      <Route path="/contact" element={<Contact />} />
      <Route path="/" element={<JobList />} />
      <Route path="/JobList" element={<JobList />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  </BrowserRouter>
);

export default App;
