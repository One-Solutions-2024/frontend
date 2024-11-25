
import "./index.css"

const Footer = () => (
    <Footer>
    <div className="footer-container">
        <section className="down-logo" id='follow-us-section'>
            <div className="logo-websitename">
                <img className="logo"
                    src="https://res.cloudinary.com/dsjcty43b/image/upload/v1726470878/WhatsApp_Image_2024-09-06_at_22.30.50_85f627e1-removebg-preview_yp7rg2.png" alt='logo' rel="noreferrer" />
                <h1 className="heading-down">ONE SOLUTIONS</h1>
            </div>
            <section id="social">
                <div className="social-links">
                    <a href="https://instagram.com/OneSolutionsEkam" target="_blank">
                        <img className="bottom-icons-instagram"
                            src="https://th.bing.com/th/id/R.735dda68880a385ce8cc5be4f3c5fcd6?rik=qSxRw2lCZYy9Mw&riu=http%3a%2f%2fpngimg.com%2fuploads%2finstagram%2finstagram_PNG11.png&ehk=QVCbfkCKi8pJLF08bRkS%2fLeMqLTnJQf402WRaIdN6jE%3d&risl=&pid=ImgRaw&r=0" alt='instagram' rel="noreferrer" />
                    </a>
                    <a href="https://www.linkedin.com/in/one-solutions-ekam-131947329/" target="_blank">
                        <img className="bottom-icons-linkedin"
                            src="https://itcnet.gr/wp-content/uploads/2020/09/Linkedin-logo-on-transparent-Background-PNG-.png" alt='linkedin' rel="noreferrer" />
                    </a>
                    <a href="https://www.youtube.com/@OneSolutionsEkam" target="_blank">
                        <img className="bottom-icons-youtube" src="https://th.bing.com/th/id/R.b800cd54a94aaecc66e8752091d26f6b?rik=ChXMqbKPu0ueGg&pid=ImgRaw&r=0" alt='youtube' rel="noreferrer" />
                    </a>
                    <a href="https://whatsapp.com/channel/0029VaoOmU93gvWdCy0dmr3z" target="_blank">
                        <i class="fab fa-whatsapp whatsapp-icon"></i>
                    </a>
                </div>
            </section>
        </section>

        <footer>
            <div className="footer-copyright">
                <p>&copy; 2024 <a className="span-copy" href="/">One Solutions</a>. All rights reserved.</p>
            </div>
        </footer>
    </div>
    </Footer>
)

export default Footer