import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
    isGuestLoginClicked: false,
  }

  onsuccesLogin = jwtToken => {
    console.log('login success')
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})

    history.replace('/')
  }

  onfailure = errorMessage => {
    this.setState({showError: true, errorMsg: errorMessage})
  }

  onUsernameChange = event => {
    this.setState({username: event.target.value})
  }

  onPasswordChange = event => {
    this.setState({password: event.target.value})
  }

  renderUsername = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="username" className="input-label">
          USERNAME
        </label>
        <input
          id="username"
          type="text"
          className="input"
          placeholder="Username"
          value={username}
          onChange={this.onUsernameChange}
        />
      </>
    )
  }

  renderPassword = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password" className="input-label">
          PASSWORD
        </label>
        <input
          id="password"
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={this.onPasswordChange}
        />
      </>
    )
  }

  onClickGuestLogin = () => {
    this.setState({isGuestLoginClicked: true})
  }

  onSubmitSuccess = async event => {
    const {isGuestLoginClicked} = this.state
    event.preventDefault()

    const loginUrl = 'https://apis.ccbp.in/login'
    if (isGuestLoginClicked) {
      this.setState({username: 'rahul', password: 'rahul@2021'})
    } else {
      const {username, password} = this.state
    }

    const {username, password} = this.state
    const userDetails = {username, password}
    console.log(username, password)
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    console.log(data)
    if ((response.ok && isGuestLoginClicked) || response.ok) {
      this.onsuccesLogin(data.jwt_token)
    } else {
      this.onfailure(data.error_msg)
    }
  }

  render() {
    const {
      username,
      password,
      showError,
      errorMsg,
      isGuestLoginClicked,
    } = this.state

    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <form className="form-container" onSubmit={this.onSubmitSuccess}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />

          <div className="input-container">{this.renderUsername()}</div>
          <div className="input-container">{this.renderPassword()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          <button
            type="submit"
            className="login-button guest"
            onClick={this.onClickGuestLogin}
          >
            Guest Login
          </button>
          {showError && isGuestLoginClicked === false && (
            <p className="error-message">*{errorMsg}</p>
          )}
        </form>
      </div>
    )
  }
}

export default Login
