import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Redirect} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import JobsContext from '../Context'

const locationsList = [
  {id: 'Hyderabad', label: 'Hyderabad'},
  {id: 'Bangalore', label: 'Bangalore'},
  {id: 'Chennai', label: 'Chennai'},
  {id: 'Delhi', label: 'Delhi'},
  {id: 'Mumbai', label: 'Mumbai'},
]

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
    locations: '',
  }

  static contextType = JobsContext

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch('https://apis.ccbp.in/profile', options)
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

    const {employmentTypeId, minimumPackage, searchInput, locations} =
      this.state

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeId}&minimum_package=${minimumPackage}&search=${searchInput}&location=${locations}`

    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const formattedJobs = data.jobs.map(each => ({
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
        jobsList: formattedJobs,
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
    const {value, checked} = event.target
    const {employmentTypeId} = this.state

    let selected = employmentTypeId ? employmentTypeId.split(',') : []

    if (checked) {
      selected.push(value)
    } else {
      selected = selected.filter(each => each !== value)
    }

    this.setState({employmentTypeId: selected.join(',')}, this.getJobsDetails)
  }

  onChangeSalary = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobsDetails)
  }

  onChangeLocation = event => {
    const {value, checked} = event.target
    const {locations} = this.state

    let selected = locations ? locations.split(',') : []

    if (checked) {
      selected.push(value)
    } else {
      selected = selected.filter(each => each !== value)
    }

    this.setState({locations: selected.join(',')}, this.getJobsDetails)
  }

  renderEmploymentFilter = () => {
    const {employmentTypesList} = this.context

    return (
      <>
        <h1>Type of Employment</h1>
        <ul>
          {employmentTypesList.map(each => (
            <li key={each.employmentTypeId}>
              <input
                type="checkbox"
                id={each.employmentTypeId}
                value={each.employmentTypeId}
                onChange={this.onChangeEmployment}
              />
              <label htmlFor={each.employmentTypeId}>{each.label}</label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderSalaryFilter = () => {
    const {salaryRangesList} = this.context

    return (
      <>
        <h1>Salary Range</h1>
        <ul>
          {salaryRangesList.map(each => (
            <li key={each.salaryRangeId}>
              <input
                type="radio"
                id={each.salaryRangeId}
                name="salary"
                value={each.salaryRangeId}
                onChange={this.onChangeSalary}
              />
              <label htmlFor={each.salaryRangeId}>{each.label}</label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderLocationFilter = () => (
    <>
      <h1>Locations</h1>
      <ul>
        {locationsList.map(each => (
          <li key={each.id}>
            <input
              type="checkbox"
              id={each.id}
              value={each.id}
              onChange={this.onChangeLocation}
            />
            <label htmlFor={each.id}>{each.label}</label>
          </li>
        ))}
      </ul>
    </>
  )

  renderProfile = () => {
    const {profileDetails, profileApiStatus} = this.state

    if (profileApiStatus === apiStatusConstants.inProgress) {
      return (
        <div data-testid="loader">
          <Loader type="ThreeDots" />
        </div>
      )
    }

    if (profileApiStatus === apiStatusConstants.failure) {
      return <button onClick={this.getProfileDetails}>Retry</button>
    }

    return (
      <div>
        <img src={profileDetails.profileImageUrl} alt="profile" />
        <h1>{profileDetails.name}</h1>
        <p>{profileDetails.bio}</p>
      </div>
    )
  }

  renderJobs = () => {
    const {jobsApiStatus, jobsList} = this.state

    if (jobsApiStatus === apiStatusConstants.inProgress) {
      return (
        <div data-testid="loader">
          <Loader type="ThreeDots" />
        </div>
      )
    }

    if (jobsApiStatus === apiStatusConstants.failure) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
          />
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for</p>
          <button onClick={this.getJobsDetails}>Retry</button>
        </div>
      )
    }

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

    if (!jwtToken) {
      return <Redirect to="/login" />
    }

    return (
      <div>
        <Header />

        <div className="profile-jobs-main-container">
          <aside className="sidebar">
            {this.renderProfile()}

            {this.renderEmploymentFilter()}

            {this.renderSalaryFilter()}

            {this.renderLocationFilter()}
          </aside>

          <section>
            <input
              type="search"
              placeholder="Search"
              onChange={this.onChangeSearch}
            />

            <button
              data-testid="searchButton"
              type="button"
              onClick={this.onClickSearch}
            >
              <BsSearch />
            </button>

            {this.renderJobs()}
          </section>
        </div>
      </div>
    )
  }
}

export default Jobs
