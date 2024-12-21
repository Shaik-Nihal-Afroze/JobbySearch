import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsSearch, BsStarFill} from 'react-icons/bs'
import Header from '../Header'

import JobItem from '../JobItem'

import Profile from '../Profile'

// import {} from 'react-icons/bs'

import './index.css'

const apiJobStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const jobFilterStatusConstant = [
  {employmentId: 'FULLTIME', label: 'FULL TIME'},
  {employmentId: 'PARTTIME', label: 'PART TIME'},
  {employmentId: 'INTERNSHIP', label: 'INTERNSHIP'},
  {employmentId: 'FREELANCE', label: 'FREELANCE'},
]
const packageStatusConstant = [
  {salaryPackageId: '1000000', label: '10 LPA and above'},
  {salaryPackageId: '2000000', label: '20 LPA and above'},
  {salaryPackageId: '3000000', label: '30 LPA and above'},
  {salaryPackageId: '4000000', label: '40 LPA and above'},
]

class JobsRoute extends Component {
  state = {
    profileData: [],
    jobsList: [],
    searchInput: '',
    radioInput: '',
    checkboxInputs: [],
    apiStatus: apiStatusConstant.initial,
    apiJobsStatus: apiJobStatusConstant.initial,
  }

  // isPartTime = this.partTime ? 'Part Time' : ''
  componentDidMount() {
    this.onGetJobList()
  }

  onGetJobList = async () => {
    this.setState({apiStatus: apiJobStatusConstant.inProgress})
    const {checkboxInputs, radioInput, searchInput} = this.state
    // const isFullTime = fullTime ? 'FULLTIME' : ''
    const jwtToken = Cookies.get('jwt_token')
    const jobsApi = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApi, options)
    if (response.ok) {
      const data = await response.json()
      // console.log(data)
      const fetchedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      console.log(fetchedData)
      this.setState({
        apiStatus: apiJobStatusConstant.success,
        jobsList: fetchedData,
      })
    } else {
      this.setState({apiStatus: apiJobStatusConstant.failure})
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.onGetJobList)
  }

  onGetInputOption = event => {
    const {checkboxInputs, radioInput} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.onGetJobList,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        prevState => ({checkboxInputs: filteredData}),
        this.onGetJobList,
      )
    }
  }

  onClickRetryButtton = () => {
    this.onGetJobList()
  }

  renderEmploymentContainer = () => (
    <>
      <ul className="check-boxes-container">
        {jobFilterStatusConstant.map(eachItem => (
          <li className="employmentInput-container" key={eachItem.employmentId}>
            <input
              type="checkbox"
              id={eachItem.employmentId}
              className="check"
              onClick={this.onGetInputOption}
            />
            <label htmlFor={eachItem.employmentId} className="label">
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    </>
  )

  renderPackageContainer = () => (
    <>
      <ul className="check-boxes-container">
        {packageStatusConstant.map(eachItem => (
          <li
            className="employmentInput-container"
            key={eachItem.salaryPackageId}
          >
            <input
              type="radio"
              id={eachItem.salaryPackageId}
              className="check"
              onClick={this.onGetRadioOption}
            />
            <label htmlFor={eachItem.salaryPackageId} className="label">
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    </>
  )

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.onGetJobList()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.onGetJobList()
    }
  }

  renderSearchInputContainer = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-contaiener">
        <input
          type="search"
          placeholder="Search"
          className="search-input"
          value={searchInput}
          onChange={this.onGetSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button"
          onClick={this.onSubmitSearchInput}
        >
          {' '}
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderNoJobsView = () => (
    <div className="noJob-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="nojobs-image"
        alt="no jobs"
      />
      <h1 className="nojob-title">No jobs Found</h1>
      <p className="no-job-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderSuccessView = () => {
    const {jobsList} = this.state
    // const {jobItemDetails} = this.props

    console.log('success view is rendered')
    console.log(jobsList)
    if (jobsList.length > 0) {
      return (
        <>
          <div className="medium-device-search-container">
            {this.renderSearchInputContainer()}
          </div>
          <ul className="jobfiltered-unorderedList">
            {jobsList.map(eachJob => (
              <JobItem jobItemDetails={eachJob} key={eachJob.id} />
            ))}
          </ul>
        </>
      )
    }
    return (
      <>
        <div className="medium-device-search-container">
          {this.renderSearchInputContainer()}
        </div>
        {this.renderNoJobsView()}
      </>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="job-route-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="job-failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryButtton}
      >
        Retry
      </button>
    </div>
  )

  renderJobResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiJobStatusConstant.success:
        return this.renderSuccessView()
      case apiJobStatusConstant.failure:
        return this.renderFailureView()
      case apiJobStatusConstant.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const {checkboxInputs, radioInput, searchInput} = this.state

    // console.log(`twentyLPA:${twentyLPA}`)
    // console.log(`thirstyLPA:${thirstyLPA}`)
    // console.log(`fourtyLPA:${fourtyLPA}`)

    return (
      <>
        <Header />
        <div className="job-route-bg-container">
          <div className="job-route-main-input-container">
            <div className="small-device-search-container">
              {this.renderSearchInputContainer()}
            </div>

            <Profile />
            <hr className="separator" />

            <div className="employment-container">
              <h1 className="employ-salary-heading">Type of Employment</h1>
              {this.renderEmploymentContainer()}
            </div>
            <hr className="separator" />
            <div className="employment-container">
              <h1 className="employ-salary-heading">Salary Range</h1>
              {this.renderPackageContainer()}
            </div>
          </div>
          <div className="result-container">{this.renderJobResult()}</div>
        </div>
      </>
    )
  }
}

export default JobsRoute
