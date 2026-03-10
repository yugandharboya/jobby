import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const onToggleLogout = () => {
    const {history} = props
    history.replace('/login')
    Cookies.remove('jwt_token')
  }
  return (
    <div className="page-header">
      <ul className="nav-container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
        </li>
        <li>
          <Link to="/" className="nav-link-items">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-link-items">
            Jobs
          </Link>
        </li>
      </ul>
      <button className="logout-button" onClick={onToggleLogout}>
        Logout
      </button>
    </div>
  )
}
export default withRouter(Header)
