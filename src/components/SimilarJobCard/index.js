import {MdLocationOn} from 'react-icons/md'

import {BsBriefcaseFill, BsStarFill} from 'react-icons/bs'

import './index.css'

const SimilarJobCard = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    id,
    title,
    rating,
    location,
    jobDescription,
    employmentType,
  } = similarJobDetails

  return (
    <li className="similarJob-container" key={id}>
      <div className="similar-logo-title">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo paddtop"
        />
        <div className="title-star-rating-container">
          <h1 className="similar-company-name">{title}</h1>
          <div className="star-rating">
            <BsStarFill className="star" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <div className="similar-main-icon-container">
        <h1 className="similar-description-title">Description</h1>
        <p className="description">{jobDescription}</p>
        <div className="location-package">
          <div className="location-icon-container">
            <MdLocationOn size={15} className="location-icon" />
            <p className="location">{location}</p>
            <BsBriefcaseFill size={15} className="location-icon" />
            <p className="location">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobCard
