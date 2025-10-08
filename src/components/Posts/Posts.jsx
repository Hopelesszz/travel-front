import React from 'react';
import "./Posts.scss";
import { useEffect, useState } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart,faComment,faXmark,faPen } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import Comments from '../Comments/Comments';
import Loader from "../../components/Loader/Loader";

const Posts = ({otherUserId,page}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [action, setAction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showComment,setShowComment] = useState(false);
    const [postId, setPostId] = useState(null);
    const [postCommentId, setPostCommentId] = useState(null);
    const { user } = useContext(AuthContext);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    
    const CustomLeftArrow = ({ onClick }) => (
    <button className="custom-arrow left" onClick={onClick}>
        &lt;
    </button>
    );
    const CustomRightArrow = ({ onClick }) => (
    <button className="custom-arrow right" onClick={onClick}>
        &gt;
    </button>
    );
    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true); 
                let res;
                if (page === "main") {
                    res = await axios.get("/posts/getAllPosts");
                } 
                else if (page === "account_info") {
                    res = await axios.get(`/posts/getPostsByUser/${user._id}`);
                } 
                else if (page === "other_account_info") {
                    res = await axios.get(`/posts/getPostsByUser/${otherUserId}`);
                }
                setPosts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false); 
            }
        };
        fetchPosts();
    }, [updateTrigger, page, user]);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const usersData = [];
                await Promise.all(
                    posts.map(async (post) => {
                        const res = await axios.get(`${API_URL}/users/getOneUser/${post.authorId}`);
                        usersData.push(res.data);
                    })
                );
                setUsers(usersData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPosts();
    }, [posts]);
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    const like = async (postId) => {
        try {         
            const post = await axios.get(`${API_URL}/posts/getOnePost/${postId}`);   
            if (post.data.authorId === user._id) {
                return;
            }
            await axios.put(`${API_URL}/posts/updatePost/${postId}`,{userId: user._id, action: "like"});
            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                        if (post._id === postId) {
                            return { ...post, likes: [...post.likes, user._id] };
                        } 
                        else {
                            return post;
                        }
                    }
                )
            );
            const user_award = axios.get(`${API_URL}/userAward/getUserAward?userId=${user._id}&awardId=68e2573f2149cfc7e2ea8386`);
            const res2 = (await user_award).data;
            if(!res2) {
                const award = await axios.post(`${API_URL}/userAward/addUserAward`,{
                    userId: user._id,
                    achievementId: "68e2573f2149cfc7e2ea8386",
                    progress: 1,
                    completed: false
                })
            }
            else if(res2.progress < 5) {
                const newProgress = res2.progress + 1;
                const completed = newProgress >= 5;
                const award = await axios.put(`${API_URL}/userAward/updateUserAward/${res2._id}`,{
                    progress: newProgress,
                    completed
                })
            }
        } catch (err) {
            console.error(err);
        }
    }
    const cancelLike = async (postId) => {
        try {            
            await axios.put(`${API_URL}/posts/updatePost/${postId}`,{userId: user._id, action: "cancel like"});   
            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                        if (post._id === postId) {
                           return { ...post, likes: post.likes.filter((id) => id !== user._id) };
                        } 
                        else {
                            return post;
                        }
                    }
                )
            );
            const user_award = axios.get(`${API_URL}/userAward/getUserAward?userId=${user._id}&awardId=68e2573f2149cfc7e2ea8386`);
            const res2 = (await user_award).data;
            if(res2.progress > 0) {
                const newProgress = res2.progress - 1;
                const completed = newProgress >= 5;
                const award = await axios.put(`${API_URL}/userAward/updateUserAward/${res2._id}`,{
                    progress: newProgress,
                    completed
                })
            }
        } catch (err) {
            console.error(err);
        }
    }
    const deletePost = async (postId) => {
       try {            
            const deletedPost = await axios.delete(`${API_URL}/posts/deletePost/${postId}`);      
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            await Promise.all(
                deletedPost.data.comments.map(async (comment) => {
                    await axios.delete(`${API_URL}/comments/deleteComment/${comment}`);
                })
            );
            const user_award = axios.get(`${API_URL}/userAward/getUserAward?userId=${user._id}&awardId=68e252122149cfc7e2ea826a`);
            const res2 = (await user_award).data;
            if(res2.progress > 0) {
                const newProgress = res2.progress - 1;
                const completed = newProgress >= 5;
                const award = await axios.put(`${API_URL}/userAward/updateUserAward/${res2._id}`,{
                    progress: newProgress,
                    completed
                })
            }
        } 
        catch (err) {
            console.error(err);
        }
    }
    const modalAsk = (postId) => {
        setShowModal(true);
        setPostId(postId);
    }
    const commentAsk = (postId) => {
        setShowComment(true);
        setPostCommentId(postId);
    }
    if (loading) return <Loader color={"white"}/>;
   return (
    <div className="posts">
        <div className="posts_container">
            <h2>Posts</h2>
            <div className="posts_container__items">
                {posts.map((post) => {
                const postAuthor = users.find((u) => u._id === post.authorId);
                    return (
                        <div key={post._id} className="posts_container__items__item">
                            {page === "account_info" ? (
                                <FontAwesomeIcon onClick={() => modalAsk(post._id)} className='delete_post' icon={faXmark} />
                            ) : <></>}
                            {postAuthor ? (
                                postAuthor.avatar ? (
                                    postAuthor._id === user?._id ? (
                                        <div className="posts_container__items__item__user">
                                                <Link style={{ textDecoration: "none",display:"flex", flexDirection:"row", alignItems:"center", gap:"10px" }} to="/account_info">
                                                    <img src={postAuthor.avatar} alt="Profile" />
                                                    <p>{postAuthor.username}</p>
                                                </Link>
                                            {post.createdAt === post.updatedAt ? (
                                                <h6>Created: 
                                                    {
                                                        new Date(post.createdAt).getDate().toString().padStart(2, "0") + "-" +
                                                        (new Date(post.createdAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                        new Date(post.createdAt).getFullYear()
                                                    }
                                                </h6>
                                            ) : (
                                                <h6>Modified:
                                                    {
                                                        new Date(post.updatedAt).getDate().toString().padStart(2, "0") + "-" +
                                                        (new Date(post.updatedAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                        new Date(post.updatedAt).getFullYear()
                                                    }
                                                </h6>
                                            )}
                                            <Link state={{ post: post }} to="/edit_post" style={{ textDecoration: "none", backgroundColor: "white" }}>
                                                <FontAwesomeIcon style={{ backgroundColor:"white",color:"black" }} icon={faPen} />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="posts_container__items__item__user">
                                                <Link state={{ user: postAuthor }} style={{ textDecoration: "none",display:"flex", flexDirection:"row", alignItems:"center", gap:"10px" }} to="/other_account_info">
                                                    <img src={postAuthor.avatar} alt="Profile" />
                                                    <p>{postAuthor.username}</p>
                                                </Link>
                                                {post.createdAt === post.updatedAt ? (
                                                    <h6>Created: 
                                                        {
                                                            new Date(post.createdAt).getDate().toString().padStart(2, "0") + "-" +
                                                            (new Date(post.createdAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                            new Date(post.createdAt).getFullYear()
                                                        }
                                                    </h6>
                                                ) : (
                                                    <h6>Modified: 
                                                        {
                                                            new Date(post.updatedAt).getDate().toString().padStart(2, "0") + "-" +
                                                            (new Date(post.updatedAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                            new Date(post.updatedAt).getFullYear()
                                                        }
                                                    </h6>
                                                )}
                                            </div>
                                    )
                                ) : (
                                    postAuthor._id === user?._id ? (
                                        <div className="posts_container__items__item__user">
                                                <Link style={{ textDecoration: "none",display:"flex", flexDirection:"row", alignItems:"center", gap:"10px" }} to="/account_info">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Profile" />
                                                    <p>{postAuthor.username}</p>
                                                </Link>
                                                {post.createdAt === post.updatedAt ? (
                                                    <h6>Created: 
                                                        {
                                                            new Date(post.createdAt).getDate().toString().padStart(2, "0") + "-" +
                                                            (new Date(post.createdAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                            new Date(post.createdAt).getFullYear()
                                                        }
                                                    </h6>
                                                ) : (
                                                    <h6>Modified: 
                                                        {
                                                            new Date(post.updatedAt).getDate().toString().padStart(2, "0") + "-" +
                                                            (new Date(post.updatedAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                            new Date(post.updatedAt).getFullYear()
                                                        }
                                                    </h6>
                                                )}
                                            <FontAwesomeIcon style={{backgroundColor:"white",color:"black"}} icon={faPen} />
                                        </div>
                                    ) : (
                                        <div className="posts_container__items__item__user">
                                                <Link state={{ user: postAuthor }} style={{ textDecoration: "none",display:"flex", flexDirection:"row", alignItems:"center", gap:"10px" }} to="/other_account_info">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Profile" />
                                                    <p>{postAuthor.username}</p>
                                                </Link>
                                                {post.createdAt === post.updatedAt ? (
                                                    <h6>Created: 
                                                        {
                                                            new Date(post.createdAt).getDate().toString().padStart(2, "0") + "-" +
                                                            (new Date(post.createdAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                            new Date(post.createdAt).getFullYear()
                                                        }
                                                    </h6>
                                                ) : (
                                                    <h6>Modified: 
                                                        {
                                                            new Date(post.updatedAt).getDate().toString().padStart(2, "0") + "-" +
                                                            (new Date(post.updatedAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                            new Date(post.updatedAt).getFullYear()
                                                        }
                                                    </h6>
                                                )}
                                            </div>
                                    )
                                )
                            ) : (
                                <></>
                            )}
                            <p className="posts_container__items__item__content">{post.content}</p>
                            <div className="posts_container__items__item__image_icons">
                                <Carousel className='posts_container__items__item__image_icons__carousel' responsive={responsive} customLeftArrow={<CustomLeftArrow/>} customRightArrow={<CustomRightArrow/>} draggable={false}>
                                    {post.images.map((image, index) => (
                                        <div style={{ backgroundColor: "white", width: "450px", height: "300px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post ${index + 1}`}
                                            style={{ backgroundColor: "white", width: "450px", height: "300px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                        </div>
                                    ))} 
                                </Carousel>
                                <nav>
                                    <span>
                                       {user ? (
                                            post.likes.includes(user._id) ? (
                                                <FontAwesomeIcon onClick={() => cancelLike(post._id)} style={{ marginLeft: "10px", color: "red" }} icon={faHeart}/>
                                            ) : (
                                                <FontAwesomeIcon onClick={() => like(post._id)} style={{ marginLeft: "10px" }} icon={faHeart}/>
                                            )
                                        ) : (
                                            <FontAwesomeIcon style={{ marginLeft: "10px" }} icon={faHeart}/>
                                        )}
                                        <p style={{ color: "black", backgroundColor: "white" }}>{post.likes?.length || 0} </p>
                                    </span>
                                    <span>
                                        <FontAwesomeIcon onClick={() => commentAsk(post._id)} icon={faComment} />
                                        <p style={{ color: "black", backgroundColor: "white" }}>{post.comments?.length || 0}</p>
                                    </span>
                                </nav>
                            </div>
                        </div>
                    );
                })}
                {showModal && (
                    <Modal 
                        itemName="post" 
                        action={action} 
                        setAction={setAction} 
                        showModal={showModal} 
                        setShowModal={setShowModal} 
                        item={postId}
                        deleteItem={deletePost}
                    />
                )}
                {showComment && (
                    <Comments
                        postId={postCommentId}
                        showComment={showComment}
                        setShowComment={setShowComment}
                        setUpdateTrigger={setUpdateTrigger}
                    />
                )}
            </div>
        </div>
    </div>
  )
}

export default Posts;