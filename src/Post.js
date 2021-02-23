import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase";
function Post({ imageUrl, user, userName, caption, id }) {
     const [comments, setComments] = useState([]);
     const [comment, setComment] = useState("");
     useEffect(() => {
          let unsubscribe;
          if (id) {
               unsubscribe = db
                    .collection("posts")
                    .doc(id)
                    .collection("comments")
                    .orderBy("timestamp", "desc")
                    .onSnapshot((snapshot) => {
                         setComments(
                              snapshot.docs.map((doc) => {
                                   return { id: doc.id, comment: doc.data() };
                              })
                         );
                    });
          }

          return () => {
               unsubscribe();
          };
     }, [id]);
     const postComments = (e) => {
          e.preventDefault();
          db.collection("posts").doc(id).collection("comments").add({
               username: user.displayName,
               comment: comment,
               timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          setComment("");
     };
     return (
          <div className="post">
               <div className="post__header">
                    <Avatar className="post__avatar" alt={userName}></Avatar>
                    <h4>{userName}</h4>
               </div>

               {/* header and the avatar and username */}
               <img src={imageUrl} alt="post img" className="post__img" />
               {/* post img */}
               <h4 className="post__text">
                    <strong>{userName}</strong>
                    {caption}
               </h4>
               <div className="post__comment__box">
                    {comments.map(({ id, comment }) => {
                         return (
                              <p key={id}>
                                   <strong>{comment.username}</strong>
                                   {comment.comment}
                              </p>
                         );
                    })}
               </div>
               {user && (
                    <form className="post__comments">
                         <input
                              type="text"
                              value={comment}
                              placeholder="comment here...."
                              onChange={(e) => setComment(e.target.value)}
                              className="post__input"
                         />
                         <button
                              disabled={!comment}
                              className="post__button"
                              type="submit"
                              onClick={postComments}
                         >
                              Post
                         </button>
                    </form>
               )}

               {/* username>>caption*/}
          </div>
     );
}

export default Post;
