import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';

import Footer from "../Footer";
import './index.css';

class Company extends Component {
  state = {
    companyData: {},
    isLoading: true,
    formattedDate: '' // Add a state variable to store the formatted date
  };

  componentDidMount() {
    this.getCompanyData();
    // Initial format of date based on screen size
    this.formatAndSetDate();

    // Add resize event listener
    window.addEventListener('resize', this.formatAndSetDate);
  }

  componentWillUnmount() {
    // Remove resize event listener to prevent memory leaks
    window.removeEventListener('resize', this.formatAndSetDate);
  }

  // Function to capitalize each word
 // Function to capitalize each word
 capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

  // Function to format date based on screen size and set it in state
  formatAndSetDate = () => {
    const { createdat } = this.state.companyData;
    if (createdat) { // Only format if the createdat value exists
      const isSmallScreen = window.innerWidth <= 768;
      const options = {
        month: isSmallScreen ? 'short' : 'long',
        day: 'numeric',
        year: 'numeric'
      };
      const formattedDate = new Date(createdat).toLocaleDateString('en-US', options);
      this.setState({ formattedDate });
    }
  };

  getCompanyData = async () => {
    const { companyname, url } = this.props.params;
    try {
      const response = await fetch(`https://backend-lt9m.onrender.com/api/jobs/company/${companyname}/${url}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company data');
      }
      const data = await response.json();
      const updatedData = {
        companyname: data.companyname,
        title: data.title,
        description: data.description || '',
        applyLink: data.apply_link,
        image: data.image,
        salary: data.salary,
        location: data.location,
        job_type: data.job_type,
        experience: data.experience,
        batch: data.batch,
        job_uploader: data.job_uploader,
        createdat: data.createdat
      };
      document.title = `${data.companyname.toUpperCase()} - ${data.title.toUpperCase()}`;


      this.setState({ companyData: updatedData, isLoading: false }, this.formatAndSetDate);
    } catch (error) {
      console.error('Error fetching company data:', error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading, companyData, formattedDate } = this.state;
    const { companyname, title, description, applyLink, image, salary, experience, batch, location, job_type, job_uploader } = companyData;

    const descriptionPoints = description ? description.split('#').map((point) => point.trim()) : [];

    return (
      <div>
        {isLoading ? (
          <div className='loader-div-company'>
            <p className="loader">Loading...</p>
          </div>
        ) : (
          <div className="details-page-container">
            <div className="current-job-container">
              <div className='right-and-left-side'>
                <div className='image-and-apply-link-heading left-side'>
                  <div className='image-small-device'>
                    <div className='job-uploader-container'>
                      <img src={assets.image_avatar} className='image-icon' alt="Job Uploader Icon" />
                      <h1 className='job-uploader-details'>By <strong className='job-uploader-name'>{job_uploader}</strong> {formattedDate}</h1>
                    </div>
                    <img src={`https://backend-lt9m.onrender.com/uploads/${image}`} alt={`${companyname}`}
                      className='job-image-details' />
                    <h2 className="heading">{companyname.toUpperCase()}: <span className="heading-details">{this.capitalizeWords(title)}</span></h2>
                    </div>
                </div>
                <div className="details-side-right-of-image">
                  <p className='box-type-rows'><span className='job-details-names'>Batch: </span>{batch}</p>
                  <p className='box-type-rows'><span className='job-details-names'>Salary: </span>{salary}</p>
                  <p className='box-type-rows'><span className='job-details-names'>Job Type: </span>{job_type}</p>
                  <p className='box-type-rows'><span className='job-details-names'>Experience: </span>{experience}</p>
                  <p className='box-type-rows'><span className='job-details-names'>Location: </span>{location}</p>
                  <div className='apply-link-container'>
                    <a href={applyLink} target="_blank" rel="noopener noreferrer" className='image-apply-link'>Apply</a>
                  </div>
                </div>
              </div>
              <hr />

              <div className='details-side'>
                <h3 className="qualifications">Qualifications:</h3>
                <ul className='descriptions-details-side'>
                  {descriptionPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
                <a href={applyLink} target="_blank" rel="noopener noreferrer" className='apply-link'>Apply Here</a>
                <hr />
                <h3 className='follow-us'>Follow Us</h3>
                <div className='follow-section'>
                  <a href="https://www.instagram.com/onesolutionsekam" target='_blank' rel='noopener noreferrer' className='follows-link'>Instagram</a>
                  <a href="https://www.youtube.com/@OneSolutionsEkam" target='_blank' rel='noopener noreferrer' className='follows-link'>YouTube</a>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

// Create a HOC that injects the params into the class component
function withRouter(Component) {
  return function ComponentWithRouterProp(props) {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
}

export default withRouter(Company);