import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsStarFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobItemDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobItemDetails
  return (
    <li className="jobItem-container">
      <Link to={`/jobs/${id}`} className="link-item">
        <div className="logo-title">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-star-rating-container">
            <h1 className="company-name">{title}</h1>
            <div className="star-rating">
              <BsStarFill className="star" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-package">
          <div className="location-icon-container">
            <MdLocationOn size={15} className="location-icon" />
            <p className="location">{location}</p>
            <BsBriefcaseFill size={15} className="location-icon" />
            <p className="location">{employmentType}</p>
          </div>
          <p className="location">{packagePerAnnum}</p>
        </div>

        <hr className="separator" />
        <h1 className="description-title">Description</h1>
        <p className="description">{jobDescription}</p>
      </Link>
    </li>
  )
}
export default JobItem
