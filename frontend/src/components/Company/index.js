import React, { Component } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import Footer from "../Footer";
import './index.css';

class Company extends Component {
  state = { companyData: {}, isLoading: true };

  componentDidMount() {
    this.getCompanyData();
  }

  getCompanyData = async () => {
    const { companyname, url } = this.props.params; // Destructure both companyname and url from params
    try {
      const response = await fetch(`https://backend-vtwx.onrender.com/api/jobs/company/${companyname}/${url}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company data');
      }
      const data = await response.json();

      const updatedData = {
        companyname: data.companyname,
        title: data.title,
        description: data.description || '', // Handle potential undefined descriptions
        applyLink: data.apply_link,
        imageLink: data.image_link,
        salary: data.salary,
        location: data.location,
        job_type: data.job_type,
        experience: data.experience,
        batch: data.batch,
      };
      this.setState({ companyData: updatedData, isLoading: false });
    } catch (error) {
      console.error('Error fetching company data:', error);
      this.setState({ isLoading: false });
    }
  };


  render() {
    const { isLoading, companyData } = this.state;
    const { companyname, title, description, applyLink, imageLink, salary, experience, batch, location, job_type } = companyData;

    // Safely handle undefined description
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
                    <img
                      src={imageLink}
                      alt={title}
                      className='job-image-details'
                    />
                  </div>
                  <div>
                    <h2 className="heading">{companyname}: <span className="heading-details">{title}</span></h2>
                  </div>
                </div>
                <div className="details-side-right-of-image">
                  <p className='box-type-rows'><span className='job-details-names'>Salary: </span>{salary}</p>
                  <p className='box-type-rows'><span className='job-details-names'>Location: </span>{location}</p>
                  <p className='box-type-rows'><span className='job-details-names'>Job Type: </span>{job_type}</p>
                  <p className='box-type-rows'><span className='job-details-names'>Experience: </span>{experience}</p>
                  <p className='box-type-rows'><span className='job-details-names'>Batch: </span>{batch}</p>
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
    const params = useParams(); // Use useParams hook to get the route parameters
    return <Component {...props} params={params} />;
  };
}

export default withRouter(Company);