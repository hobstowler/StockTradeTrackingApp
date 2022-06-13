import React from 'react'
import { log_in, register_new_user } from '../middleware/login';

export default class LoginForm extends React.Component {
    constructor(props) {
      super();
      this.state = {
        username:"none",
        password:"none",
        clientID:"none",
        register: 'no',
        error: ""
      };
      this.handleInput =this.handleInput.bind(this);
      this.login = this.login.bind(this);
      this.register = this.register.bind(this);
      this.cancel_register = this.cancel_register.bind(this);
      this.register_user = this.register_user.bind(this);
    }
  
    handleInput(event) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  
    login(props) {
      const username = this.state.username;
      const password = this.state.password;
      log_in(username, password)
      .then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            var ID = data.clientID;
            var TDurl = "https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=https://localhost:3000&client_id="+ID+"%40AMER.OAUTHAP";
            window.location.href = TDurl;
          })
        }
        else {
          response.json().then(data => {
            this.setState({error: data.error});
          })
        }
      })
    }
  
    register_user() {
      console.log("registering new user......");
      const username = this.state.username;
      const password = this.state.password;
      const clientID = this.state.clientID;
      register_new_user(username, password, clientID)
      .then(response => {
        if (response.status === 200) {
          this.setState({register: 'no'}); 
        }
        else {
          response.json().then(data => {
            this.setState({error: data.error});
          });
        }
      })
    }
  
    register() {this.setState({register: 'yes'});}
  
    cancel_register() {this.setState({register: 'no'});}
  
    render() {
      const register = this.state.register;
      const error = this.state.error;
  
      if (register === 'no') {
        return (
          <div class="login_frame">
            <form class="login_input" >
              Please log in to proceed.<br />
              <input type="text" id="username" name="username" onChange={this.handleInput} placeholder="Username" /><br />
              <input type="password" id="password" name="password" onChange={this.handleInput} placeholder="Password" />
            </form>
            <div class="login_button_frame">
              <button class="login_button" id="login_button" onClick={this.login}>Log In</button>
              <button class="login_button" id="register_button" onClick={this.register}>New User</button>
              {error}
            </div>
          </div>
        )
      }
      else if (register === 'yes') {
        return (
          <div class="login_frame">
              Please enter a username and password.<br />
              <input type="text" id="username" name="username" onChange={this.handleInput} placeholder="Username" required /><br />
              <input type="password" id="regpass" name="password" onChange={this.handleInput} placeholder="Password" required /><br />
              <input type="text" id="clientID" name="clientID" onChange={this.handleInput} placeholder="Client ID" required /><br />
              <button type="submit" onClick={this.register_user} value="Register">Register</button>
            <button onClick={this.cancel_register}>Back...</button>
            {error}
          </div>
          
        )
      }    
    }
  }