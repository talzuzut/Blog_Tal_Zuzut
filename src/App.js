import React from "react";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import About from "./About";
import NewPost from "./NewPost";
import Container from "./PostPage";

export default function App() {
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
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

function Home() {
    return <h2>Welcome to my practice Home page, Enjoy</h2>;
}


