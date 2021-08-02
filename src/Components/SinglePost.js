import React, {useEffect, useState} from 'react';
import '../App.css';
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";
import Post from "./Post";
import AllComments from "./AllComments";


const SinglePost = (props) => {
    const {id} = useParams();
    const [user_id, setUser_id] = useState(props.userID);
    const [session_id, setSession_id] = useState(props.sessionID);
    const [content, setContent] = useState("")
    const [publishedBy, setPublishedBy] = useState("")
    const [publishedDays, setPublishedDays] = useState("")
    const [new_comm, setNew_comm] = useState("")
    // const [is_editor, setIs_editor] = useState(false);
    const history = useHistory();
    console.log("post id is " + id + "user id is " + user_id + " session id is " + session_id)
    useEffect(() => {
        console.log("in Single.." + id)
        axios.get('/api/posts/' + id).then(response => {
            console.log(response.data)
            if (response && response.data && response.status === 200) {
                setContent(response.data['content'])
                setPublishedDays(response.data['publishedDays'])
                setPublishedBy(response.data['publishedBy'])
            }
        })
            // if (session_id)
            // { axios.get('/api/validate/' + session_id).then(response => {
            //     if (response && response.data && response.status === 200) {
            //         setIs_editor(response.data === user_id)
            //     }
            // });}
    });

    const handleSubmit = (event) => {
        axios.post("/api/comments/"+id, {content:new_comm,author:user_id})
            .then(response => {
                if (response && response.status === 200) {
                    window.alert("Successfully added Post ");
                    history.push("/posts/"+id);
                }
            }).catch((err) => {
            window.alert("Not Authorised, try again!");
        });

    }

    return (
        <table className='border_space' id='MainTable'>
            <tbody>
            <tr>
                <td>
                    {<Post content={content} id={id} publishedBy={publishedBy} publishedDays={publishedDays}/>}
                </td>
            </tr>
            <tr>
                <td>
                    <br/>
                    <h3 class="display-6"> Comments: </h3>
                    <AllComments id={id}/>
                </td>
            </tr>
            {session_id &&
            <tr>
            <td>
             Add a comment:
                <form>
                    <input type="text" name="comm_text"  onChange={e=>setNew_comm(e.target.value)}/>
                    <input type="submit" value="Submit" onClick={handleSubmit}/>
                </form>
            </td>
            </tr>
            }
            </tbody>
        </table>
    );
}
export default SinglePost;