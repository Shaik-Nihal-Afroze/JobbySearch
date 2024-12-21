import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-content">
      <div className="navbar-container">
        <li className="link-item link-navbar-logo">
          <Link to="/" className="link-item ">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="navbar-website-logo"
            />
          </Link>
        </li>
        <ul className="navbar-icons-container">
          <Link to="/" className="link-item">
            <AiFillHome className="header-icons" size={30} />
          </Link>
          <Link to="/jobs" className="link-item">
            <BsBriefcaseFill className="header-icons" size={30} />
          </Link>

          <button
            type="button"
            className="logout-button-image"
            onClick={onClickLogout}
          >
            <FiLogOut className="header-icons" size={30} />
          </button>
        </ul>
        <ul className="desktop-navbar-icons-container">
          <Link to="/" className="link-item">
            <li className="nav-list-item">Home</li>
          </Link>
          <Link to="/jobs" className="link-item">
            <li className="nav-list-item">Jobs</li>
          </Link>
        </ul>
        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
