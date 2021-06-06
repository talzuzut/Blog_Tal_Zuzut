import React from 'react';
import axios from "axios";

export default class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            publishedBy: '',
            publishedDays: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
        console.log("changed ", nam, val);
    }

    handleSubmit(event) {
        console.log("state-", this.state)
        axios({
            method: 'post',
            url: '/posts',
            data: {
                ...this.state
            }
        });
        window.alert("Successfully added Post by- " + this.state.publishedBy);
    }

    render() {
        return (
            <tr>
                <td>
                    <h1> Here you would insert <b>NEW POST </b></h1>
                    <form>
                        <label>
                            Post Content:
                            <input type="text" name="content" onChange={this.handleChange}/>
                        </label>
                        <label>
                            Author:
                            <input type="text" name="publishedBy" onChange={this.handleChange}/>
                        </label>
                        <label>
                            How many days ago?:
                            <input type="text" name="publishedDays" onChange={this.handleChange}/>
                        </label>
                        <input type="submit" value="Submit" onClick={this.handleSubmit}/>
                    </form>
                </td>
            </tr>

        );

    }

}
