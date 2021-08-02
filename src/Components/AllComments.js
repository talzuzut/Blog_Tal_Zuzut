import React from 'react';
import '../App.css';
import axios from "axios";
import Comment from "./Comment";


export default class AllComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:props.id,
            comments_list: []
        };
    }

    componentDidMount() {
        axios.get('/api/comments/'+this.state.id).then(response => {

            if (response && response.data && response.status === 200) {
                this.setState({
                    comments_list: response.data
                })

            }
        });
    }

    render() {
        const commentsList =
            this.state.comments_list.map(comment =>

                <tr><Comment {...comment}/></tr>
            )
        console.log(commentsList)
        return (
            <table className='table' id='MainTable'>
                <tbody>
                {commentsList}
                </tbody>
            </table>
        );
    }
}

