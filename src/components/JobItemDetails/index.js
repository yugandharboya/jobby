import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {FaBriefcase, FaExternalLinkAlt} from 'react-icons/fa'
import {AiFillStar} from 'react-icons/ai'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params

    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const job = data.job_details

      const formattedJob = {
        id: job.id,
        title: job.title,
        rating: job.rating,
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        skills: job.skills,
        lifeDescription: job.life_at_company.description,
        lifeImageUrl: job.life_at_company.image_url,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
      }

      const similar = data.similar_jobs.map(each => ({
        id: each.id,
        title: each.title,
        rating: each.rating,
        companyLogoUrl: each.company_logo_url,
        location: each.location,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
      }))

      this.setState({
        jobDetails: formattedJob,
        similarJobs: similar,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoading = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.getJobDetails}>Retry</button>
    </div>
  )

  renderSuccess = () => {
    const {jobDetails, similarJobs} = this.state

    return (
      <div>
        <img src={jobDetails.companyLogoUrl} alt="job details company logo" />

        <h1>{jobDetails.title}</h1>

        <p>{jobDetails.rating}</p>

        <p>{jobDetails.location}</p>

        <p>{jobDetails.employmentType}</p>

        <p>{jobDetails.packagePerAnnum}</p>

        <h1>Description</h1>

        <a href={jobDetails.companyWebsiteUrl} target="_blank" rel="noreferrer">
          Visit
        </a>

        <p>{jobDetails.jobDescription}</p>

        <h1>Skills</h1>

        <ul>
          {jobDetails.skills.map(skill => (
            <li key={skill.name}>
              <img src={skill.image_url} alt={skill.name} />
              <p>{skill.name}</p>
            </li>
          ))}
        </ul>

        <h1>Life at Company</h1>

        <p>{jobDetails.lifeDescription}</p>

        <img src={jobDetails.lifeImageUrl} alt="life at company" />

        <h1>Similar Jobs</h1>

        <ul>
          {similarJobs.map(job => (
            <li key={job.id}>
              <img src={job.companyLogoUrl} alt="similar job company logo" />

              <h1>{job.title}</h1>

              <p>{job.rating}</p>

              <p>{job.location}</p>

              <p>{job.employmentType}</p>

              <p>{job.jobDescription}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <div>
        <Header />
        {this.renderJobDetails()}
      </div>
    )
  }
}

export default JobItemDetails
