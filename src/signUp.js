import React from "react";
import axios from 'axios';
import ReactDOM from "react-dom";
import App from "./App";
export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            resp: null,
            user: null,
            pass: null,
        };

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

    doSignUp = (e) => {
        const url = "/signUp";
        const data = {
            user: this.state.user,
            pass: this.state.pass
        }

        axios.post(url, data)
            .then((res) => {
                this.setState({
                    data: [],
                    resp: "Success: user signed up."
                });
                window.alert("Signed Up successfully!");
                window.location.href = "http://localhost:3000/";
                ReactDOM.render(
                    <React.StrictMode>
                        <App />
                    </React.StrictMode>,
                    document.getElementById('root')
                );
            })
            .catch((err) => {
                this.setState({
                    data: [],
                    resp: "Error: failed to signup user."
                });
                window.alert("Username taken!");
                document.getElementById("signupForm").reset();
            });
    }
    render()
     {
return (
    <div id="formContent">
        <div> Signup Page</div>
        <div className="fadeIn first">
        </div>

        <form id ='signupForm'>
            <input type="text" id="user" className="fadeIn second" name="login" placeholder="Username" onChange={this.changeUsername}/>
            <input type="password" id="pass" className="fadeIn third" name="password" placeholder="Password" onChange={this.changePassword}/>
            <input type="button" className="fadeIn fourth" value="Signup" onClick={this.doSignUp}/>
        </form>


    </div>
);

}
    }