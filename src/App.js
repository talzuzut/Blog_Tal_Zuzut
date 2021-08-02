import React from "react";
import {BrowserRouter as Router, Link, Route, Switch, useParams} from "react-router-dom";
import About from "./Pages/About";
import NewPost from "./Components/NewPost";
import Container from "./Components/AllPosts";
import Login from "./Components/Login";
import SignUp from "./Pages/signUp";
import axios from "axios";
import Cookies from 'universal-cookie';
import AbbContainer from "./Components/AbbPost";
import MyPosts from "./Components/myPosts";
import SinglePost from "./Components/SinglePost";
/*TODO:
1. Redirect (also render leads to signing out) in the end of Newpost, and logout


*/
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            session_id: "",
            userID: ""
        };
    }

    handleLogChange = ({logVal, userID}) => {
        console.log("Handle logchange -logVal " + logVal + " user_id = " + userID);
        let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)session_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        this.setState({
            isLoggedIn: logVal, session_id: cookieValue,
            userID: userID
        })
    }

    newPostHandle = ({logVal, userID}) => {
        this.setState({
        post_count:1
        })
    }
    logout = (e) => {
        const cookies = new Cookies();
        const sess_id = cookies.get('session_id')
        console.log(sess_id);
        if (sess_id === undefined) {
            window.alert("login first");
            return;
        }
        this.setState({session_id: sess_id})
        const url = "/api/logout";
        const data = {
            session_id: cookies.get('session_id')
        }
        axios.post(url, data)
            .then((res) => {
                this.setState({
                    isLoggedIn: false,
                    session_id: ""
                });
                cookies.remove('session_id');
                window.alert("Logged out successfully ")
            })
            .catch((err) => {
                window.alert("Logout failed!");
            });

    }

    render() {
        const {isLoggedIn, userID, session_id} = this.state;
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"/>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <a className="nav-link active" aria-current="page">
                                            <Link to="/">Home </Link></a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link"> <Link to="/about">About </Link></a>
                                    </li>
                                    {isLoggedIn &&
                                    <li className="nav-item">
                                        <a className="nav-link"><Link to="/newPost">NewPost </Link></a>
                                    </li>
                                    }
                                    <li className="nav-item">
                                        <a className="nav-link"><Link to="/postPage">PostPage </Link></a>

                                    </li>
                                    {isLoggedIn &&
                                    <li className="nav-item">
                                        <a className="nav-link"><Link to="/myPosts">My Posts </Link></a>
                                    </li>
                                    }
                                    {!isLoggedIn ?

                                        <li className="nav-item">
                                            <a className="nav-link"><Link to="/login">Login </Link></a>

                                        </li>
                                        :

                                        <li className="nav-item">
                                            <button className="btn btn-secondary nav-link"
                                                    onClick={this.logout}> Logout
                                            </button>
                                        </li>}


                                </ul>
                            </div>
                        </div>
                    </nav>

                    <Switch>
                        <Route path="/posts/:id" >
                            <SinglePost userID={userID} sessionID={session_id}/>
                        </Route>
                        <Route path="/about">
                            <About/>
                        </Route>
                        <Route path="/newPost">
                            <NewPost userID={userID} onNameChange={this.newPostHandle}/>
                        </Route>
                        <Route path="/postPage">
                            <Container/>
                        </Route>
                        <Route path="/login">
                            <Login isLoggedIn={isLoggedIn} onNameChange={this.handleLogChange}/>
                        </Route>
                        <Route path="/signUp">
                            <SignUp/>
                        </Route>
                        <Route path="/myPosts">
                            <MyPosts userID={userID} session_id={session_id}/>
                        </Route>
                        <Route path="/">
                            <AbbContainer/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}


