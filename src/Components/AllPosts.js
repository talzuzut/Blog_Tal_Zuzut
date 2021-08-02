import React from 'react';
import '../App.css';
import axios from "axios";
import Post from "./Post";


export default class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts_list: []
        };
    }

    componentDidMount() {
        console.log('All posts deploy..')
        axios.get('/api/posts').then(response => {

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

                <tr><Post {...post}/></tr>
            )
        console.log(postsList)
        return (
            <table className='border_space' id='MainTable'>
                <thead>
                <tr>
                    <td>
                        <h1> All Posts</h1>
                    </td>
                </tr>
                </thead>
                <tbody>
                {postsList}
                </tbody>
            </table>
        );
    }
}

