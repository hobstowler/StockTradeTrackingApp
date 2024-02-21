import React from 'react'
import {fetchAccessToken, getCookie, refreshAccessToken} from '../middleware/authentication';

const version = "version: 0.0.35"

export default class Authenticator extends React.Component {
  constructor(props) {
    super();
    this.state = {
      authenticated: "no"
    };
    this.refreshAuth = this.refreshAuth.bind(this)
  }

  componentDidMount() {
    var access_token = encodeURIComponent(getCookie("access_token"))
    var refresh_token = encodeURIComponent(getCookie("refresh_token"))
    if ((access_token === "") && (refresh_token !== "")) {
      refreshAccessToken()
      this.setState({authenticated: "yes"});
    } else if (refresh_token === "") {
      fetchAccessToken()
      this.setState({authenticated: "yes"});
    } else {
      this.setState({authenticated: "no"});
    }
  }

  refreshAuth() {
    var refresh_token = encodeURIComponent(getCookie("refresh_token"))
    if (refresh_token === "")
    {
      fetchAccessToken();
      this.setState({authenticated: "yes"});
    } else {
      refreshAccessToken();
      this.setState({authenticated: "yes"});
    }
  }

  render() {
    const auth = this.state.authenticated
    if (auth === "no") {
      return (
        <div class="auth">
          <button onClick={this.refreshAuth()}>Refresh Authentication</button>
        </div>
      )
    } else {
      return (
        <div class="auth">Authenticated</div>
      )
    }
  }
}