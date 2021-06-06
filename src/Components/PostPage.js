import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import reportWebVitals from '../reportWebVitals';
import axios from "axios";


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


class PostComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <td className='whole_border'>
      <span>
        <h3>Blog post {this.props.id} </h3>
          {this.props.content}
      </span>
                <br/> <br/> <br/>
                <span
                    className='bottom'> Published {this.props.publishedDays} days ago by {this.props.publishedBy}</span>
            </td>
        );
    }
}

export default class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts_list: []
        };
    }

    componentDidMount() {
        axios.get('/posts').then(response => {

            if (response && response.data && response.status === 200) {
                this.setState({
                    posts_list: response.data
                })

            }
        });
    }

    render() {
        const postsList =
            this.state.posts_list.map(post =>

                <tr><PostComponent {...post}/></tr>
            )
        console.log(postsList)
        return (
            <table className='border_space' id='MainTable'>
                <thead>
                <MainHeader/>
                </thead>
                <tbody>
                {postsList}
                </tbody>
            </table>
        );
    }
}

// ReactDOM.render(<Container/>, document.getElementById('root'));
