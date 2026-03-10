import './index.css'
import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {FaBriefcase} from 'react-icons/fa'
import {AiFillStar} from 'react-icons/ai'

const JobItem = props => {
  const {jobDetails} = props

  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-item">
        <div className="logo-title-rating-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo-url"
          />

          <div>
            <h1>{title}</h1>

            <div className="rating-icon-container">
              <AiFillStar color="yellow" />
              <p>{rating}</p>
            </div>
          </div>
        </div>

        <div className="location-intensionship-package-container">
          <div className="location-icon-container">
            <div className="location-container">
              <MdLocationOn />
              <p>{location}</p>
            </div>

            <div className="icon-container">
              <FaBriefcase />
              <p>{employmentType}</p>
            </div>
          </div>

          <p>{packagePerAnnum}</p>
        </div>

        <hr />

        <h1>Description</h1>

        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
