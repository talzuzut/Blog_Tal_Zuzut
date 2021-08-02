import React from 'react';
import '../App.css';

export default class Comment extends React.Component {
    render() {
        return (
            <td className='comment'>

                <br/>
                <figure className="text-center">
                    <blockquote className="blockquote">
                        <p>{this.props.content}</p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        <cite title="Source Title">Published By {this.props.author}</cite>
                    </figcaption>
                </figure>
                <span
                    className='bottom'>  </span>
            </td>
        );
    }
}