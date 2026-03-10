import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {Redirect} from 'react-router-dom'
import Header from '../Header'
import JobItem from '../JobItem'
import JobsContext from '../Context'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    employmentTypeId: '',
    minimumPackage: '',
    searchInput: '',
  }

  static contextType = JobsContext

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    const data = await response.json()

    if (response.ok) {
      const profile = data.profile_details

      this.setState({
        profileDetails: {
          name: profile.name,
          profileImageUrl: profile.profile_image_url,
          bio: profile.short_bio,
        },
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobsDetails = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})

    const {employmentTypeId, minimumPackage, searchInput} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeId}&minimum_package=${minimumPackage}&search=${searchInput}`

    const response = await fetch(url, {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    const data = await response.json()

    if (response.ok) {
      const jobs = data.jobs.map(each => ({
        id: each.id,
        title: each.title,
        rating: each.rating,
        companyLogoUrl: each.company_logo_url,
        location: each.location,
        employmentType: each.employment_type,
        packagePerAnnum: each.package_per_annum,
        jobDescription: each.job_description,
      }))

      this.setState({
        jobsList: jobs,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobsDetails()
  }

  onChangeEmployment = event => {
    this.setState({employmentTypeId: event.target.value}, this.getJobsDetails)
  }

  onChangeSalary = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobsDetails)
  }

  renderJobsList = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }

    return (
      <ul>
        {jobsList.map(job => (
          <JobItem key={job.id} jobDetails={job} />
        ))}
      </ul>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    const {employmentTypesList, salaryRangesList} = this.context

    return (
      <div className="jobs-bg-container">
        <Header />

        <input
          type="search"
          placeholder="Search"
          onChange={this.onChangeSearch}
        />

        <button data-testid="searchButton" onClick={this.onClickSearch}>
          <BsSearch />
        </button>

        <h1>Type of Employment</h1>

        <ul>
          {employmentTypesList.map(each => (
            <li key={each.employmentTypeId}>
              <input
                type="checkbox"
                value={each.employmentTypeId}
                id={each.employmentTypeId}
                onChange={this.onChangeEmployment}
              />
              <label htmlFor={each.employmentTypeId}>{each.label}</label>
            </li>
          ))}
        </ul>

        <h1>Salary Range</h1>

        <ul>
          {salaryRangesList.map(each => (
            <li key={each.salaryRangeId}>
              <input
                type="radio"
                name="salary"
                value={each.salaryRangeId}
                id={each.salaryRangeId}
                onChange={this.onChangeSalary}
              />
              <label htmlFor={each.salaryRangeId}>{each.label}</label>
            </li>
          ))}
        </ul>

        {this.renderJobsList()}
      </div>
    )
  }
}

export default Jobs
