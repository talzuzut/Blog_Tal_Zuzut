import React from "react";
import axios from 'axios';
import * as ReactDOM from "react-dom";
import App from "./App";
export default class Login extends React.Component
{  constructor(props) {
    super(props);
    this.state = {
        data: [],
        resp: null,
        user: null,
        pass: null,
        isLoggedIn:null
    };
}
    handleInputChange = event => {
        this.props.onNameChange(event.target.value)
    }
changeUsername = (e) => {
    this.setState({
        user: e.target.value,
    });
}

changePassword = (e) => {
    this.setState({
        pass: e.target.value,
    });
}

doLogin = (e) => {
    const url = "/login";
    const data = {
        user: this.state.user,
        pass: this.state.pass
    }
    axios.post(url, data)
        .then((res) => {
            this.setState({
                data: [],
                resp: "Success: user logged in.",
                isLoggedIn: true
            });
            window.alert("Success!"+this.state.isLoggedIn);
            document.getElementById("loginForm").reset();
            window.location.href = "http://localhost:3000/";
            return <App isLoggedIn={true} />;

        })
        .catch((err) => {
            this.setState({
                data: [],
                resp: "Error: failed to login user."
            });
            this.setState({
                success: 'not_auth!'
            });
            window.alert("Not Authorised, try again!");
            document.getElementById("loginForm").reset();
        });
}

render() {
    return (
        <div id="formContent">
            <div> Login Page</div>
            <div className="fadeIn first">
            </div>

            <form id ='loginForm'>
                <input type="text" id="user" className="fadeIn second" name="login" placeholder="Username" onChange={this.changeUsername}/>
                <input type="password" id="pass" className="fadeIn third" name="password" placeholder="Password" onChange={this.changePassword}/>
                <input type="button" className="fadeIn fourth" value="Log In" onClick={this.doLogin}/>
            </form>

            <div id="formFooter">
                <a className="underlineHover" href="#">Forgot Password?</a>
                <br/>
                <a href="/signUp" className="underlineHover">SignUp</a>
            </div>

        </div>
    );

}}