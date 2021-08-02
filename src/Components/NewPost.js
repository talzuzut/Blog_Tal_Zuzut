import React, {useState} from 'react';
import axios from "axios";
import TextField from '@material-ui/core/TextField';
import {useHistory} from "react-router-dom";

// class NewPost extends React.Component {
const NewPost = (props) => {
    const history = useHistory();
    const [content, setContent] = useState("");
    const [publishedDays, setPublishedDays] = useState("");
    const [userID, setUserID] = useState(props.userID);
    console.log(userID);
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);


    // handleChange = (event) => {
    //     let nam = event.target.name;
    //     let val = event.target.value;
    //     this.setState({[nam]: val});
    //     console.log("changed ", nam, val);
    // }

    const handleSubmit = (event) => {
        console.log("content-"+content+ " publishedDays-"+publishedDays+" userID-"+userID);
        axios.post("/api/posts", {content:content,publishedDays:publishedDays,userID:userID})
            .then(response => {
                if (response && response.status === 200) {
                    window.alert("Successfully added Post ");
                  history.push("/login");
                }
            }).catch((err) => {
            window.alert("Not Authorised, try again!");
        });

    }


    return (
        <tr>
            <td>
                <h1> Here you would insert <b>NEW POST </b></h1>
                <form>
                    <TextField
                        id="outlined-multiline-static"
                        name="content"
                        label="Post Content"
                        onChange={e=>setContent(e.target.value)}
                        multiline
                        rows={10}
                        variant="outlined"
                    />
                    <td>
                        <label>
                            How many days ago?:
                            <input type="text" name="publishedDays" id="days" onChange={e=>setPublishedDays(e.target.value)}
                            />
                        </label>
                    </td>
                    <tr>
                        <td>
                            <input type="submit" value="Submit" onClick={handleSubmit}/>
                        </td>
                    </tr>
                </form>


            </td>
        </tr>

    );
}


export default NewPost;
