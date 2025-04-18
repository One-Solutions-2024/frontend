import { assets } from "../../assets/assets";

import "./index.css"

const Footer = () => (
    <div className="footer-container">
        <section className="down-logo" id='follow-us-section'>
            <div className="logo-websitename">
                <img className="logo"
                    src={assets.company_logo} alt='logo' rel="noreferrer" />
                <h1 className="heading-down">ONE SOLUTIONS</h1>
            </div>
            <section id="social">
                <div className="social-links">
                    <a href="https://instagram.com/OneSolutionsEkam" target="_blank" rel="noreferrer">
                        <img className="bottom-icons-instagram"
                            src={assets.footer_insta_icon} alt='instagram' rel="noreferrer" />
                    </a>
                    <a href="https://www.linkedin.com/in/one-solutions-ekam-ose-131947329/" target="_blank" rel="noreferrer">
                        <img className="bottom-icons-linkedin"
                            src={assets.footer_linkedin_icon} alt='linkedin' rel="noreferrer" />
                    </a>
                    <a href="https://www.youtube.com/@OneSolutionsEkam" target="_blank" rel="noreferrer">
                        <img className="bottom-icons-youtube" src={assets.footer_youtube_icon} alt='youtube' rel="noreferrer" />
                    </a>
                    <a href="https://whatsapp.com/channel/0029VaoOmU93gvWdCy0dmr3z" target="_blank" rel="noreferrer">
                        <i className="fab fa-whatsapp whatsapp-icon"></i>
                    </a>
                </div>
            </section>
        </section>

        <footer>
            <div className="footer-copyright">
                <p>&copy; 2024 <a className="span-copy" href="/">One Solutions</a>. All rights reserved.</p>
            </div>
            <div>
                <a href="/privacy-policy" className="span-copy privacy">Privacy Policy</a>
                <a href="/disclaimer" className="span-copy">Disclaimer</a>
            </div>
        </footer>
    </div>
)

export default Footer