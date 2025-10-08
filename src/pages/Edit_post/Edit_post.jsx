import React from 'react';
import Header from '../../components/Header/Header';
import "./Edit_post.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";

const Edit_post = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [content,setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    let urls = [];
    const location = useLocation();
    const post = location.state.post;
    const navigate = useNavigate();
    const editPost = async (e) => { 
        e.preventDefault(); 
        try { 
            let uploadRes;
            if (files.length > 0) {
                await Promise.all( 
                    Object.values(files).map(async (file) => { 
                        const data = new FormData(); 
                        data.append("file", file); 
                        data.append("upload_preset", "upload"); 
                        uploadRes = await axios.post( "https://api.cloudinary.com/v1_1/dhe6tnpg0/image/upload", data, { withCredentials: false } ); 
                        const { url } = uploadRes.data; 
                        urls.push(url);
                    })
                ); 
            }
            let editedPost;
            if (urls.length === 0) {
                editedPost = {
                    content: content,
                    action: "default update"
                }
            }
            else {
                editedPost = {
                    images: urls,
                    content: content,
                    action: "default update"
                }
            }
            await axios.put(`${API_URL}/posts/updatePost/${post._id}`, editedPost, { withCredentials: true }); 
            navigate("/");
        } 
        catch (error) { 
            if (error.response) { 
                setError(error.response.data.message); 
            } 
            else { 
                setError("Something went wrong!"); 
            } 
        } 
    }

    return (
       <>
            <Header/>
            <div className="form_add_award_container">
                <form onSubmit={editPost}>
                <h2>Edit Post</h2>
                    <div className="form_add_award_container__content">
                        <div className="form_container__content__field">
                            <label>Photos</label>
                            <label htmlFor="avatar"><FontAwesomeIcon className='upload_photo' icon={faImage} /></label>
                            <input multiple onChange={(e) => setFiles([...e.target.files])} accept="image/*" type="file" id="avatar" name="avatar" style={{ display: "none" }} />
                        </div>
                        <div style={{ height: "312px" }} className="form_container__content__field">
                            <label htmlFor="description">Content</label>
                            <textarea style={{ height: "312px" }} onChange={(e) => setContent(e.target.value)} id="description" name="description" required></textarea>
                        </div>
                        <div className="form_add_award_container__content__button">
                            <button style={{backgroundColor:"rgba(237, 100, 69, 1)"}} type="submit">Edit Post</button>
                        </div>
                        {error && <p className="error">{error}</p>}
                        </div>
                </form>
            </div> 
        </>
    )
}
export default Edit_post;
