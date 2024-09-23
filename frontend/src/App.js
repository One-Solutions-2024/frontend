import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import JobList from './JobList';
import NotFound from './components/NotFound';
import Header from './components/Header';
import Details from './components/Details';
import Contact from './components/Contact';
import "./App.css";

const App = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/details/:companyname" element={<Details />} /> {/* Using company name */}
      <Route path="/contact" element={<Contact />} />
      <Route path="/" element={<JobList />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  </BrowserRouter>
);

export default App;
