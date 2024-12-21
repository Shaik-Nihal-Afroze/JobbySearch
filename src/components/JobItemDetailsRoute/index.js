import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'

import {BsBriefcaseFill, BsStarFill} from 'react-icons/bs'

import {RiShareBoxLine} from 'react-icons/ri'
import SimilarJobCard from '../SimilarJobCard'
import SkillCard from '../SkillCard'
import Header from '../Header'

import './index.css'

const jobItemDetailsStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetailsRoute extends Component {
  state = {
    jobItemData: {},
    similarJobs: [],
    jobItemApiStatus: jobItemDetailsStatusConstant.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getFormatSimilarJobData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
    title: data.title,
  })

  getJobItemDetails = async () => {
    this.setState({jobItemApiStatus: jobItemDetailsStatusConstant.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const jobItemDetailsApi = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobItemDetailsApi, options)

    if (response.ok) {
      const data = await response.json()
      // console.log(data)
      const jobDetails = this.getFormattedData(data.job_details)
      const similarJobList = data.similar_jobs.map(eachSimilarJob =>
        this.getFormatSimilarJobData(eachSimilarJob),
      )
      this.setState({
        jobItemData: jobDetails,
        similarJobs: similarJobList,
        jobItemApiStatus: jobItemDetailsStatusConstant.success,
      })
    } else {
      this.setState({jobItemApiStatus: jobItemDetailsStatusConstant.failure})
    }
  }

  renderSuccessJobItemIdDetails = () => {
    const {jobItemData, similarJobs} = this.state
    console.log(similarJobs)
    const {
      companyLogoUrl,
      title,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      rating,
      lifeAtCompany = {},
      location,
      packagePerAnnum,
      skills = [],
    } = jobItemData
    const {description, imageUrl} = lifeAtCompany
    // console.log(skills)
    return (
      <div className="jobItemDetails-main-container">
        <Header />
        <div className="jobItemDetails-bg-container">
          <div className="jobItemDetails-container">
            <div className="logo-title">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="title-star-rating-container">
                <h1 className="jobItemDetails-company-name">{title}</h1>
                <div className="star-rating">
                  <BsStarFill className="star" />
                  <p className="jobItemDetails-rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package">
              <div className="location-icon-container">
                <MdLocationOn size={15} className="location-icon" />
                <p className="jobItemDetails-location">{location}</p>
                <BsBriefcaseFill size={15} className="location-icon" />
                <p className="jobItemDetails-location">{employmentType}</p>
              </div>
              <p className="jobItemDetails-location">{packagePerAnnum}</p>
            </div>

            <hr className="separator" />
            <div className="description-website-url-container">
              <h1 className="jobItemDetails-company-name ">Description</h1>
              <a href={companyWebsiteUrl} target="" className="vist-link">
                Visit <RiShareBoxLine size={15} className="share-icon" />
              </a>
            </div>

            <p className="jobItemDetails-description ">{jobDescription}</p>
            <h1 className="jobItemDetails-company-name margintop">Skills</h1>
            <ul className="skills-unorderedlist">
              {skills.map(eachSkill => (
                <SkillCard skillDetails={eachSkill} key={eachSkill.name} />
              ))}
            </ul>

            <h1 className="jobItemDetails-company-name margintop">
              Life at Company
            </h1>
            <div className="lifeatcompany-des-img-container">
              <p className="life-at-company-description">{description}</p>
              <img src={imageUrl} className="life-at-company-image" />
            </div>
          </div>
          <h1 className="jobItemDetails-company-name margintop">
            Similar Jobs
          </h1>
          <ul className="similarJob_unorderedList">
            {similarJobs.map(eachSimilarJob => (
              <SimilarJobCard
                similarJobDetails={eachSimilarJob}
                key={eachSimilarJob.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="job-failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobResult = () => {
    const {jobItemApiStatus} = this.state
    switch (jobItemApiStatus) {
      case jobItemDetailsStatusConstant.success:
        return this.renderSuccessJobItemIdDetails()
      case jobItemDetailsStatusConstant.failure:
        return this.renderFailureView()
      case jobItemDetailsStatusConstant.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const {jobItemData} = this.state
    // const {companyLogoUrl} = jobItemData

    return this.renderJobResult()
  }
}

export default JobItemDetailsRoute
