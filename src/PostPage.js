import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import reportWebVitals from './reportWebVitals';

class MainMenu extends React.Component {
    render() {
        return (
            <tr>
                <td>
                    <span><a href={""}> Home </a>|</span>
                    <span> <a href={""}>About Me </a> |</span>
                    <span> <a href={""}>Contact Me </a></span>

                </td>
                <td className='login'><a href={""}> Login </a></td>
            </tr>);
    }
}

class MainHeader extends React.Component {
    render() {
        return (
            <tr>
                <td>
                    <h1> This is my blog</h1>
                </td>
                <td>
                    <h1 className='rightSide' id='latest'> Latest</h1>
                </td>
            </tr>
        );
    }
}

class PopularHeader extends React.Component {
    render() {
        return (
            <h1 className='rightSide' id='popular'> Popular</h1>
        );
    }
}


class PostComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: "",
            content: "",
            publishedDays: "",
            publishedBy: "",
        };
    }

    render() {
        return (
            <td className='whole_border'>
      <span>
        <h3>Blog post {this.props.number} </h3>
          {this.props.content}
      </span>
                <br/> <br/> <br/>
                <span
                    className='bottom'> Published {this.props.publishedDays} days ago by {this.props.publishedBy}</span>
            </td>
        );
    }
}

class LatestPosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: "",
            link: "",
        };
    }

    render() {
        return (
            <span> Blog Post #{this.props.number} <a href={this.props.link}> go to page</a> <br/> <br/>
      </span>);
    }
}

const post1 = {
    number: "1",
    content: `My  first blog post 
        is all about my  blog post
    and how to write a new post in my  blog, you can find it  here. `,
    publishedDays: "1",
    publishedBy: "Israel"
}

const post2 = {
    number: "2",
    content: ` My  second blog post 
                 is all about my blog post`,
    publishedDays: "2",
    publishedBy: "Joe"
}
const blog1 = {
    number: '1',
    link: ""
}
const blog2 = {
    number: '2',
    link: ""
}
const blog3 = {
    number: '3',
    link: ""
}


export default class Container extends React.Component {
    render() {
        return (
            <table className='border_space' id='MainTable'>

                {/*<MainMenu/>*/}
                <MainHeader/>
                <tr>
                    <PostComponent {...post1} />
                    <td className='border_bottom'>
                        <LatestPosts {...blog1} />
                        <LatestPosts {...blog2} />
                        <LatestPosts {...blog3} />
                    </td>
                </tr>
                <tr>
                    <PostComponent {...post2} />
                    <td className='border_bottom'>
                        <PopularHeader/>
                        <LatestPosts {...blog3} />
                        <LatestPosts {...blog1} />
                        <LatestPosts {...blog2} />
                    </td>
                </tr>

            </table>


        );
    }
}

ReactDOM.render(<Container/>, document.getElementById('root'));


reportWebVitals();