import React from 'react';
import '../App.css';
import axios from "axios";


class MainHeader extends React.Component {
    render() {
        return (
            <tr>
                <td>
                    <h1>The Latest Posts </h1>
                </td>
            </tr>
        );
    }
}


class AbbPostComponent extends React.Component {


    render() {
        return (
            <td className='whole_border'>
      <span>
        <h3 className={'my_header'}>Blog post {this.props.id} </h3>
      </span>
                <span
                    className='bottom'> Published {this.props.publishedDays} days ago by {this.props.publishedBy}</span>
            </td>
        );
    }
}

export default class AbbContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts_list: []
        };
    }

    componentDidMount() {
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

                <tr><AbbPostComponent {...post} key={post.id}/></tr>
            )
        return (
            <table className='border_space AbbTable'>
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

