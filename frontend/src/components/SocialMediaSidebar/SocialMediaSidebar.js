import { 
  Facebook, 
 // Youtube, 
//  Instagram, 
  Linkedin } from "lucide-react"
// import { FaWhatsapp } from "react-icons/fa"
import { assets } from "../../assets/assets"
import "./SocialMediaSidebar.css"

export default function SocialMediaSidebar() {

  const socialMediaItems = [
 /*   {
      name: "WHATSAPP",
      icon: <FaWhatsapp size={24} />,
      url: "https://whatsapp.com/channel/0029VaoOmU93gvWdCy0dmr3z",
    },

    */
    {
      name: "FACEBOOK",
      icon: <Facebook size={24} />,
      url: "https://www.facebook.com/profile.php?id=100015794794387",
    },
    {
      name: "LINKEDIN",
      icon: <Linkedin size={24} />,
      url: "https://www.linkedin.com/company/106892681/admin/dashboard/",
    },

    /*
    {
      name: "YOUTUBE",
      icon: <Youtube size={24} />,
      url: "https://www.youtube.com/@OneSolutionsEkam",
    },

    */

    /*
    {
      name: "INSTAGRAM",
      icon: <Instagram size={24} />,
      url: "https://instagram.com/OneSolutionsEkam",
    },

    */
    {
      name: "OJB",
      src: assets.ojb_logo,
      url: "https://onejobsboard.onrender.com/",
    },
  ]

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 sc-sidebar">
      {socialMediaItems.map((item) => {
        const platformClass = `sc-${item.name.toLowerCase()}`
        return (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sc-link"
          >
            <div className={`sc-item ${platformClass}`}>
              <div className="sc-name">{item.name}</div>
              <div className="sc-icon">
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.name}
                    className="h-6 w-6 object-contain ojb-icon-sidebar"
                  />
                ) : (
                  item.icon
                )}
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )
}
