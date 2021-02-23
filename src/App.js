import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { Modal, makeStyles, Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";
function getModalStyle() {
     const top = 50;
     const left = 50;

     return {
          top: `${top}%`,
          left: `${left}%`,
          transform: `translate(-${top}%, -${left}%)`,
     };
}

const useStyles = makeStyles((theme) => ({
     paper: {
          position: "absolute",
          width: 400,
          backgroundColor: theme.palette.background.paper,
          border: "2px solid #000",
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
     },
}));

function App() {
     const classes = useStyles();
     const [modalStyle] = useState(getModalStyle);
     const [post, setPost] = useState([]);
     const [openSignUp, setOpenSignUp] = useState(false);
     const [openSignin, setOpenSignin] = useState(false);
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [username, setUsername] = useState("");
     const [user, setUser] = useState(null); //for tracking logged in user

     useEffect(() => {
          const unsubscribe = auth.onAuthStateChanged((authUser) => {
               if (authUser) {
                    //user is logged in
                    setUser(authUser);
               } else {
                    setUser(null);
               }
          });
          return () => {
               unsubscribe();
          };
     }, [user, username]);
     useEffect(() => {
          db.collection("posts")
               .orderBy("timestamp", "desc")
               .onSnapshot((snapshot) => {
                    setPost(
                         snapshot.docs.map((doc) => {
                              return {
                                   id: doc.id,
                                   post: doc.data(),
                              };
                         })
                    );
               });
     }, []);
     const signup = (e) => {
          e.preventDefault();
          auth.createUserWithEmailAndPassword(email, password)
               .then((authUser) => {
                    return authUser.user.updateProfile({
                         displayName: username,
                    });
               })
               .catch((err) => alert(err.message));
          setEmail("");
          setPassword("");
          setOpenSignUp(false);
     };
     const signin = (e) => {
          e.preventDefault();
          auth.signInWithEmailAndPassword(email, password).catch((err) =>
               alert(err.message)
          );
          setEmail("");
          setPassword("");
          setOpenSignin(false);
     };
     return (
          <div className="App">
               <Modal
                    open={openSignUp}
                    onClose={() => setOpenSignUp(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
               >
                    <div style={modalStyle} className={classes.paper}>
                         <form className="app__signup">
                              <center>
                                   <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1CnIHBLeQy8C05KYoM16jhZbFthqcVuGm7w&usqp=CAU"
                                        className="app__headerImg"
                                        alt="logo"
                                   />
                              </center>
                              <Input
                                   placeholder="Username"
                                   type="text"
                                   value={username}
                                   onChange={(e) => setUsername(e.target.value)}
                              />
                              <Input
                                   placeholder="Email"
                                   type="text"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                              />
                              <Input
                                   placeholder="Password"
                                   type="password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                              />
                              <Button type="submit" onClick={signup}>
                                   Sign up
                              </Button>
                         </form>
                    </div>
               </Modal>

               {/* Sign in modal */}

               <Modal
                    open={openSignin}
                    onClose={() => setOpenSignin(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
               >
                    <div style={modalStyle} className={classes.paper}>
                         <form className="app__signup">
                              <center>
                                   <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1CnIHBLeQy8C05KYoM16jhZbFthqcVuGm7w&usqp=CAU"
                                        className="app__headerImg"
                                        alt="logo"
                                   />
                              </center>
                              <Input
                                   placeholder="Email"
                                   type="text"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                              />
                              <Input
                                   placeholder="Password"
                                   type="password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                              />
                              <Button type="submit" onClick={signin}>
                                   Sign in
                              </Button>
                         </form>
                    </div>
               </Modal>
               <div className="app__header">
                    <img
                         src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1CnIHBLeQy8C05KYoM16jhZbFthqcVuGm7w&usqp=CAU"
                         className="app__headerImg"
                         alt="logo"
                    />
                    {user ? (
                         <Button
                              onClick={() => {
                                   auth.signOut();
                              }}
                         >
                              Logout
                         </Button>
                    ) : (
                         <div className="app__loginContainer">
                              <Button onClick={() => setOpenSignUp(true)}>
                                   Sign up
                              </Button>
                              <Button onClick={() => setOpenSignin(true)}>
                                   Sign in
                              </Button>
                         </div>
                    )}
               </div>
               <div className="app__posts">
                    <div className="app__post__left">
                         {post.map(({ id, post }) => {
                              return (
                                   <Post
                                        key={id}
                                        id={id}
                                        imageUrl={post.imageUrl}
                                        userName={post.username}
                                        caption={post.caption}
                                        user={user}
                                   />
                              );
                         })}
                    </div>
                    <div className="app__post__right">
                         <InstagramEmbed
                              url="https://www.instagram.com/p/CEbEarCqKPc/"
                              maxWidth={320}
                              hideCaption={false}
                              containerTagName="div"
                              protocol=""
                              injectScript
                              onLoading={() => {}}
                              onSuccess={() => {}}
                              onAfterRender={() => {}}
                              onFailure={() => {}}
                         />
                    </div>
               </div>
               {user?.displayName ? (
                    <ImageUpload username={user.displayName} />
               ) : (
                    <h3>Please Login to Upload Image</h3>
               )}
          </div>
     );
}

export default App;
