import { assets } from '../../assets/assets'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src={assets.not_found_blog_img}
      alt="not-found"
      className="not-found-img"
    />
  </div>
)

export default NotFound