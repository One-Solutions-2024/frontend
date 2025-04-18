import { assets } from "../../assets/assets";
import './index.css'

const Contact = () => (
  <div className="contact-container">
    <h1 className="contact-heading">Contact Me</h1>
    <div className="contact-details">
    <img
      src={assets.contact_blog_img}
      alt="contact"
      className="contact-img"
    />
    <div className="contact-right-side">
      <a  href="https://www.youtube.com/@OneSolutionsEkam" target="_blank" rel="noopener noreferrer">
          <img src={assets.YouTube_Logo} alt="YouTube" className='youtube-logo-contact' />
        </a>
        <a className='button-whatsapp' href="https://whatsapp.com/channel/0029VaoOmU93gvWdCy0dmr3z" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-whatsapp header-whatsapp"></i>Whatsapp
            </a>
        <a href="https://www.instagram.com/onesolutionsekam/" target="_blank" className="instagram-link" rel="noopener noreferrer">
          <img src={assets.Instagram_icon} alt="Instagram" className="instagram-logo" />
          Follow
        </a>

      <a className="nav-link-mail nav-link" href="mailto:onesolutions06092024@gmail.com" target="_blank" rel="noopener noreferrer">
        <img src={assets.Gmail_Icon} alt="Mail" className="mail-logo" />
        MAIL
      </a>

    </div>
    </div>
  </div>
)

export default Contact