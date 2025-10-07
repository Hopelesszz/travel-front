import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark,faPen,faTrashCan,faComment } from '@fortawesome/free-solid-svg-icons';
import "./Comments.scss";
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import Modal from "../../components/Modal/Modal";
import { HashLink } from 'react-router-hash-link';
import { Link } from "react-router-dom";

const Comments = ({ postId, showComment, setShowComment,setUpdateTrigger }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [updatedComment, setUpdatedComment] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [responseCommentId,setResponseCommentId] = useState(null);
    const [action, setAction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [commentId, setCommentId] = useState(null);
    const [userId,setUserId] = useState(null); 
    const [responsedComment,setResponsedComment] = useState("");
    const onClose = () => {
        setShowComment(false);
    };
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`${API_URL}/comments/getCommentsByPost/${postId}`);
                setComments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComments();
    }, [postId]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = [];
                await Promise.all(
                    comments.map(async (comment) => {
                        const res = await axios.get(`${API_URL}/users/getOneUser/${comment.authorId}`);
                        usersData.push(res.data);
                    })
                );
                setUsers(usersData);
            } catch (err) {
                console.error(err);
            }
        };
        if (comments.length > 0) {
            fetchUsers();
        }
    }, [comments]);

    const addComment = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/comments/addComment`, {
                postId: postId,
                authorId: user._id,
                content: newComment
            });
            setComments((prev) => [...prev, res.data]);
            setUsers((prev) => [...prev, user]);
            setNewComment("");
            await axios.put(`${API_URL}/posts/updatePost/${postId}`, {
                action: "add comment",
                commentId: res.data._id
            });
            setUpdateTrigger((prev) => prev + 1);
            const user_award = axios.get(`${API_URL}/userAward/getUserAward?userId=${user._id}&awardId=68e254a12149cfc7e2ea82ef`);
            const res2 = (await user_award).data;
            if(!res2) {
                const award = await axios.post(`${API_URL}/userAward/addUserAward`,{
                    userId: user._id,
                    achievementId: "68e254a12149cfc7e2ea82ef",
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
            console.log(err);
        }
    };
    const editComment = async (e,commentId) => {
        e.preventDefault();
        try {
            const res  = await axios.put(`${API_URL}/comments/updateComment/${commentId}`,{
                content: updatedComment
            }) 
            setComments((prev) => prev.filter((comment) => comment._id !== commentId));
            setComments((prev) => [...prev, res.data]);
            setUpdatedComment("");
            setEditCommentId(null)
        } catch (err) {
            console.log(err);
        }
    };
    const responseComment = async (e,commentId) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/comments/addComment`, {
                postId: postId,
                authorId: user._id,
                content: responsedComment,
                parentId: commentId 
            });
            setComments((prev) => [...prev, res.data]);
            setUsers((prev) => [...prev, user]);
            setResponsedComment("");
            setResponseCommentId(null);
            await axios.put(`${API_URL}/posts/updatePost/${postId}`, {
                action: "add comment",
                commentId: res.data._id
            });
            setUpdateTrigger((prev) => prev + 1);
            const user_award = axios.get(`${API_URL}/userAward/getUserAward?userId=${user._id}&awardId=68e254a12149cfc7e2ea82ef`);
            const res2 = (await user_award).data;
            if(!res2) {
                const award = await axios.post(`${API_URL}/userAward/addUserAward`,{
                    userId: user._id,
                    achievementId: "68e254a12149cfc7e2ea82ef",
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
            console.log(err);
        }
    }
    const deleteComment = async (comment_id,user_id) => {
        try {
            await axios.delete(`${API_URL}/comments/deleteComment/${comment_id}`);
            setComments((prev) => prev.filter((comment) => comment._id !== comment_id));
            setUsers((prev) => prev.filter((user) => user._id !== user_id));
            setNewComment("");
            await axios.put(`${API_URL}/posts/updatePost/${postId}`, {
                action: "delete comment",
                commentId: comment_id
            });
            setUpdateTrigger((prev) => prev + 1);
            const user_award = axios.get(`${API_URL}/userAward/getUserAward?userId=${user._id}&awardId=68e254a12149cfc7e2ea82ef`);
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
            console.log(err);
        }
    }
    const modalAsk = (commentId,userId) => {
        setShowModal(true);
        setCommentId(commentId);
        setUserId(userId);
    }
    return (
        showComment && (
            <div className="background">
                <div className='comment'>
                    <FontAwesomeIcon onClick={onClose} className='closeComment' icon={faXmark} />
                    <div className="comment__container">
                        {comments && comments.length > 0 ? (
                            comments.map((comment) => {
                                console.log(users);
                                const commentAuthor = users.find((user) => user._id === comment.authorId);
                                let userToResponse;
                                if(comment.parentId !== null) {
                                    const parentComment = comments.find((maybeParentComment) => comment.parentId === maybeParentComment._id);
                                    userToResponse  = users.find((user) => user._id === parentComment?.authorId);
                                }
                                const isCurrentUser = commentAuthor?._id?.toString() === user._id?.toString();
                                return (
                                    <div key={comment._id} id={`comment-${comment._id}`} className="comment__container__item">
                                        {commentAuthor?.avatar ? (
                                            <div className="posts_container__items__item__user">
                                                {isCurrentUser ? (
                                                    <Link style={{ textDecoration: "none",display:"flex", flexDirection:"row", alignItems:"center", gap:"10px" }} to="/account_info">
                                                        <img src={commentAuthor.avatar} alt="Profile" />
                                                        <p>{commentAuthor.username}</p>
                                                    </Link>
                                                ) : (
                                                    <Link state={{ user: commentAuthor }} style={{ textDecoration: "none",display:"flex", flexDirection:"row", alignItems:"center", gap:"10px" }} to="/other_account_info">
                                                        <img src={commentAuthor.avatar} alt="Profile" />
                                                        <p>{commentAuthor.username}</p>
                                                    </Link>
                                                )}
                                                {userToResponse ? (
                                                    <HashLink 
                                                        onClick={(e) => {
                                                            e.preventDefault(); 
                                                            let el = document.querySelector(`#comment-${comment.parentId}`);
                                                            el.scrollIntoView({ behavior: "smooth" });
                                                            el.style.backgroundColor = "rgb(221, 255, 255)";
                                                            el.style.borderRadius = "10px";
                                                            el.style.padding = "8px";
                                                            setTimeout(() => {
                                                                el.style.backgroundColor = "white";
                                                                el.style.borderRadius = "none";
                                                            }, 2000)
                                                        }} 
                                                        smooth to={`#comment-${comment.parentId}`} id="response">
                                                        @{userToResponse.username}
                                                    </HashLink>
                                                ) : (
                                                    <></>
                                                )}
                                                {comment.createdAt === comment.updatedAt ? (
                                                    <h6>Created: 
                                                        {
                                                            new Date(comment.createdAt).getDate().toString().padStart(2, "0") + "-" +
                                                            (new Date(comment.createdAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                            new Date(comment.createdAt).getFullYear()
                                                        }
                                                    </h6>
                                                ) : (
                                                    <h6>Modified:
                                                        {
                                                            new Date(comment.updatedAt).getDate().toString().padStart(2, "0") + "-" +
                                                            (new Date(comment.updatedAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                            new Date(comment.updatedAt).getFullYear()
                                                        }
                                                    </h6>
                                                )}
                                                {user ? (
                                                    commentAuthor && commentAuthor._id === user?._id ? (
                                                        <>
                                                            <FontAwesomeIcon onClick={() => setEditCommentId(editCommentId === comment._id ? null : comment._id)} id="edit_comment" icon={faPen}/>
                                                            <FontAwesomeIcon onClick={() => modalAsk(comment._id, commentAuthor._id)} id="delete_comment" icon={faTrashCan}/>
                                                            <FontAwesomeIcon id="add_response" onClick={() => setResponseCommentId(responseCommentId === comment._id ? null : comment._id)} icon={faComment}/>
                                                        </>
                                                    ) : (
                                                        <FontAwesomeIcon id="add_response" onClick={() => setResponseCommentId(responseCommentId === comment._id ? null : comment._id)} icon={faComment}/>
                                                    )
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="posts_container__items__item__user">
                                                 {isCurrentUser ? (
                                                <Link style={{ textDecoration: "none",display:"flex", flexDirection:"row", alignItems:"center", gap:"10px" }} to="/account_info">
                                                    <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Profile" />
                                                    <p>{commentAuthor?.username || "Unknown user"}</p>
                                                </Link>
                                                ) : (
                                                    <Link state={{ user: commentAuthor }} style={{ textDecoration: "none",display:"flex", flexDirection:"row", alignItems:"center", gap:"10px" }} to="/other_account_info">
                                                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Profile" />
                                                        <p>{commentAuthor?.username || "Unknown user"}</p>
                                                    </Link>
                                                )}
                                                {userToResponse ? (
                                                    <HashLink 
                                                        onClick={(e) => {
                                                            e.preventDefault(); 
                                                            let el = document.querySelector(`#comment-${comment.parentId}`);
                                                            el.scrollIntoView({ behavior: "smooth" });
                                                            el.style.backgroundColor = "rgb(221, 255, 255)";
                                                            el.style.borderRadius = "10px";
                                                            el.style.padding = "8px";
                                                            setTimeout(() => {
                                                                el.style.backgroundColor = "white";
                                                                el.style.borderRadius = "none";
                                                            }, 2000)
                                                        }} 
                                                        smooth to={`#comment-${comment.parentId}`} id="response">
                                                        @{userToResponse.username}
                                                    </HashLink>
                                                ) : (
                                                    <></>
                                                )}
                                                {comment.createdAt === comment.updatedAt ? (
                                                <h6>Created: 
                                                    {
                                                        new Date(comment.createdAt).getDate().toString().padStart(2, "0") + "-" +
                                                        (new Date(comment.createdAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                        new Date(comment.createdAt).getFullYear()
                                                    }
                                                </h6>
                                                ) : (
                                                    <h6>Modified:
                                                        {
                                                            new Date(comment.updatedAt).getDate().toString().padStart(2, "0") + "-" +
                                                            (new Date(comment.updatedAt).getMonth() + 1).toString().padStart(2, "0") + "-" +
                                                            new Date(comment.updatedAt).getFullYear()
                                                        }
                                                    </h6>
                                                )}
                                                {user ? (
                                                    commentAuthor && commentAuthor._id === user?._id ? (
                                                        <>
                                                            <FontAwesomeIcon onClick={() => setEditCommentId(editCommentId === comment._id ? null : comment._id)} id="edit_comment" icon={faPen}/>
                                                            <FontAwesomeIcon onClick={() => modalAsk(comment._id, commentAuthor._id)} id="delete_comment" icon={faTrashCan}/>
                                                            <FontAwesomeIcon id="add_response" onClick={() => setResponseCommentId(responseCommentId === comment._id ? null : comment._id)} icon={faComment}/>
                                                        </>
                                                    ) : (
                                                        <FontAwesomeIcon id="add_response" onClick={() => setResponseCommentId(responseCommentId === comment._id ? null : comment._id)} icon={faComment}/>
                                                    )
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        )}
                                        {editCommentId === comment._id ? (
                                            <>
                                                <p style={{width: "450px"}}>{comment.content}</p>
                                                <form className='comment__edit' onSubmit={(e) => editComment(e,editCommentId)}>
                                                    <textarea value={updatedComment} onChange={(e) => setUpdatedComment(e.target.value)} required/>
                                                    <button type="submit">Edit Comment</button>   
                                                </form>
                                            </>
                                        ) : (
                                            <p style={{width: "450px"}}>{comment.content}</p>
                                        )}
                                        {responseCommentId === comment._id ? (
                                            <>
                                                <form className='comment__edit' onSubmit={(e) => responseComment(e,responseCommentId)}>
                                                    <textarea value={responsedComment} onChange={(e) => setResponsedComment(e.target.value)} required/>
                                                    <button style={{backgroundColor:"rgb(60, 165, 60)"}} type="submit">Add response</button>   
                                                </form>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <p id='no_comments'>No comments yet</p>
                        )}
                    </div>
                        <form onSubmit={addComment} className='comment__add'>
                        {user ? (
                            <>
                                <h1>Add comment</h1>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                />
                                <button type="submit">Add Comment</button>
                            </>
                        ) : (
                            <></>
                        )}
                        </form>
                    {showModal && (
                        <Modal 
                            itemName="comment" 
                            action={action} 
                            setAction={setAction} 
                            showModal={showModal} 
                            setShowModal={setShowModal} 
                            item={commentId}
                            additionalItem={userId}
                            deleteItem={deleteComment}
                        />
                    )}
                </div>
            </div>
        )
    );
};
export default Comments;