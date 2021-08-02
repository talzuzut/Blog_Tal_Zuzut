import React from "react";
import axios from 'axios';
import {withRouter} from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            resp: null,
            user: null,
            pass: null,
            isLoggedIn: props.isLoggedIn
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
        const url = "/api/login";
        const data = {
            user: this.state.user,
            pass: this.state.pass
        }
        axios.post(url, data)
            .then((res) => {
                this.setState({
                    data: data,
                    resp: "Success: user logged in.",
                    isLoggedIn: true,
                    user_id: res["data"]["user_id"]
                });
                window.alert("Success!");
                this.props.onNameChange({logVal: true, userID: this.state.user_id});
                console.log(this.props)
                this.props.history.push("/");
            })
            .catch((err) => {
                this.setState({
                    data: [],
                    resp: "Error: failed to login user.",
                    success: 'not_auth!'
                });
                window.alert("Not Authorised, try again!");
            });
    }

    render() {
        return (
            <div id="formContent">
                <div> Login Page</div>
                <div className="fadeIn first">
                </div>

                <form id='loginForm'>
                    <input type="text" id="user" className="fadeIn second" name="login" placeholder="Username"
                           onChange={this.changeUsername}/>
                    <input type="password" id="pass" className="fadeIn third" name="password" placeholder="Password"
                           onChange={this.changePassword}/>
                    <input type="button" className="fadeIn fourth" value="Log In" onClick={this.doLogin}/>
                </form>

                <div id="formFooter">
                    <a className="underlineHover" href="#">Forgot Password?</a>
                    <br/>
                    <a href="/signUp" className="underlineHover">SignUp</a>
                </div>

            </div>
        );

    }
}

export default withRouter(Login);