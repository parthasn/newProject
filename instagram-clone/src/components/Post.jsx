import React, { useState, useEffect } from 'react'
import './module.post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from '../firebase';
import firebase from 'firebase'
//import { Button } from '@material-ui/core';

function Post({username, caption, imageUrl, postId, user }) {

    const [ comments, setComments ] = useState([]);
    const [ comment, setComment ] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => (
                    doc.data()
            )));
            });

        }
        return () => {
            unsubscribe()
        }
    }, [ postId ])

    const handlePostComment = (e) => {
        e.preventDefault()
        db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    console.log("comments", comments)
    return (
        <div className = "post">
            <div className="post_header">
            <Avatar
                className = "post_avatar"
                alt = "DakotaJ"
                src = "/static/images/avatar/1.jpg"
            />
            <h3>{username}</h3>
            </div>
            
            <img className = "post_image" src = {imageUrl} alt = ""/>
            <p className = "post_text"><strong>{username}:</strong> {caption}</p>
            <div className="post_comments">
            {
                comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))
            }
            </div>
            <form className = "post_commentBox">
                <input
                className = "post_input"
                type = "text"
                placeholder = "Add a comment..."
                value = {comment}
                onChange = {(e) => setComment(e.target.value) }
                />
                <button
                className = "post_button"
                disabled = {!comment}
                type = "submit"
                onClick = {handlePostComment}
                >
                    Post
                </button>
            </form>
        </div>
    )
}

export default Post
