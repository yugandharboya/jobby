import './index.css'
import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

class Home extends Component {
  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <div className="home-bg-container">
        <Header />

        <h1 className="find-job-text">Find The Job That Fits Your Life</h1>

        <p className="home-page-text">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential
        </p>

        <Link to="/jobs">
          <button className="find-jobs-button">Find Jobs</button>
        </Link>
      </div>
    )
  }
}

export default Home
