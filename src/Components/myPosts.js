import React from 'react';
import '../App.css';
import axios from "axios";
import Post from "./Post";
import EdiText from 'react-editext'
import {IconButton,} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

export default class MyPosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            my_posts_list: [],
            user_id: props.userID,
            session_id: props.session_id,
            last: ""
        };
    }

    componentDidMount() {
        console.log('/api/posts/user/' + this.state.user_id)
        axios.get('/api/posts/user/' + this.state.user_id).then(response => {
            if (response && response.data && response.status === 200) {
                this.setState({
                    my_posts_list: response.data
                })
            }
        }).catch(err => err);


    }

    onSave = (value, id) => {
        axios.put('/api/posts/' + id, {content: value, session_id: this.state.session_id}).then(response => {
            if (response && response.status === 200) {
                this.componentDidMount();
            }
        })
            .catch(err => err);

    }

    render() {
        const myPostsList =
            this.state.my_posts_list.map(post =>
                <tr>

                    <Post {...post}/>
                    <IconButton aria-label="delete" onClick={(e) => this.deletePost(post.id, e)}>
                        <DeleteIcon/>
                    </IconButton>
                    <EdiText
                        type='textarea'
                        inputProps={{
                            className: 'textarea',
                            placeholder: 'Type your content here',
                            style: {
                                outline: 'none',
                                minWidth: 'auto',
                            },
                            rows: 5
                        }}
                        value={post.content}
                        onSave={value => this.onSave(value, post.id)}
                    />
                </tr>
            )

        return (
            <table className='border_space' id='MainTable'>
                <thead>
                <tr>
                    <td>
                        <h1> My Posts</h1>
                    </td>
                </tr>
                </thead>
                <tbody>
                {myPostsList}
                </tbody>
            </table>);

    }

    deletePost = (id) => {
        axios.delete('/api/posts/' + id, {data: {session_id: this.state.session_id}}).then(response => {
            if (response && response.data && response.status === 200) {
                window.alert("Post had been deleted")
                this.setState({
                    my_posts_list: this.state.my_posts_list.filter(item => item.id !== id)
                })

            }

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
}


