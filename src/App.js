import React from "react";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import About from "./Pages/About";
import NewPost from "./Components/NewPost";
import Container from "./Components/PostPage";
import Login from "./Components/Login";
import SignUp from "./Pages/signUp";
import axios from "axios";
import Cookies from 'universal-cookie';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            session_id: ""
        };
    }

    handleLogChange = logVal => {
        this.setState({isLoggedIn:logVal})


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
        const url = "/logout";
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
        const {isLoggedIn} = this.state;

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
                                        <a className="nav-link active" aria-current="page" href="/">Home</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link"> <Link to="/about">About </Link></a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link"><Link to="/newPost">NewPost </Link></a>
                                    </li>
                                    <li className="nav-item">
                                    <a className="nav-link"><Link to="/postPage">PostPage </Link></a>
                                </li>
                                    {!isLoggedIn ?
                                        <li className="nav-item">
                                        <a className="nav-link"><Link to="/login">Login </Link></a>

                                        </li>    :
                                        <li>
                                        <button className="btn btn-secondary" onClick={this.logout}> Logout</button>
                                        </li>}
                                </ul>
                            </div>
                        </div>
                    </nav>


                    {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                    <Switch>
                        <Route path="/about">
                            <About/>
                        </Route>
                        <Route path="/newPost">
                            <NewPost/>
                        </Route>
                        <Route path="/postPage">
                            <Container/>
                        </Route>
                        <Route path="/login">
                            <Login isLoggedIn={this.state.isLoggedIn} onNameChange={this.handleLogChange}/>
                        </Route>
                        <Route path="/signUp">
                            <SignUp/>
                        </Route>
                        <Route path="/">
                            <Home/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

function Home() {
    return <h2>Welcome to my practice Home page, Enjoy</h2>;
}


