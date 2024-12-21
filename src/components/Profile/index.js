import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import './index.css'

const profileAPiStatusConstant = {
  initial: 'INTITAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Profile extends Component {
  state = {
    profileData: {},
    apiStatus: profileAPiStatusConstant.initial,
  }

  componentDidMount() {
    this.getProfileData()
  }

  convertDataToJson = data => ({
    name: data.name,
    profileImageUrl: data.profile_image_url,
    shortBio: data.short_bio,
  })

  getProfileData = async () => {
    this.setState({apiStatus: profileAPiStatusConstant.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileApiUrl, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const fetchedData = this.convertDataToJson(data.profile_details)
      this.setState({
        apiStatus: profileAPiStatusConstant.success,
        profileData: fetchedData,
      })
    } else {
      this.setState({apiStatus: profileAPiStatusConstant.failure})
    }
  }

  onClickRetryButtton = () => {
    this.getProfileData()
  }

  renderProfileView = () => {
    const {profileData} = this.state
    const {profileImageUrl, name, shortBio} = profileData
    return (
      <div className="profile-card-container">
        <img src={profileImageUrl} className="profile-image" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryButtton}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case profileAPiStatusConstant.success:
        return this.renderProfileView()
      case profileAPiStatusConstant.failure:
        return this.renderFailureView()
      case profileAPiStatusConstant.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }
}
export default Profile
