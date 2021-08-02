import React from "react";
import {BrowserRouter as Router, Link} from "react-router-dom";

export default class Post extends React.Component {
    render() {
        const url = "/posts/" + this.props.id;
        return (
            <td className='whole_border'>
      <span>
        <h3 class={'my_header'}>
                              <Link to={url}> Blog post {this.props.id}   </Link>
        </h3>
          {this.props.content}
      </span>
                <br/> <br/> <br/>
                <span
                    className='bottom'> Published {this.props.publishedDays} days ago by {this.props.publishedBy}</span>
            </td>
        );
    }
}