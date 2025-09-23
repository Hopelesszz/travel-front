import React from 'react'
import Header from '../../components/Header/Header';
import "./Add_post.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const Add_post = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [content,setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const addPost = async (e) => { 
        e.preventDefault(); 
        try { 
            const list = await Promise.all( 
                Object.values(files).map(async (file) => { 
                    const data = new FormData(); 
                    data.append("file", file); 
                    data.append("upload_preset", "upload"); 
                    const uploadRes = await axios.post( "https://api.cloudinary.com/v1_1/dhe6tnpg0/image/upload", data, { withCredentials: false } ); 
                    const { url } = uploadRes.data; 
                    return url; 
                }
                )); 
                const newPost = { authorId: user._id, content: content, images: list, }; 
                await axios.post(`${API_URL}/posts/addPost`, newPost); 
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
                <form onSubmit={addPost}>
                <h2>Add Post</h2>
                    <div className="form_add_award_container__content">
                        <div className="form_container__content__field">
                            <label>Photos</label>
                            <label htmlFor="avatar"><FontAwesomeIcon className='upload_photo' icon={faImage} /></label>
                            <input multiple onChange={(e) => setFiles([...e.target.files])} type="file" id="avatar" name="avatar" style={{ display: "none" }} />
                        </div>
                        <div style={{ height: "312px" }} className="form_container__content__field">
                            <label htmlFor="description">Content</label>
                            <textarea style={{ height: "312px" }} onChange={(e) => setContent(e.target.value)} id="description" name="description" required></textarea>
                        </div>
                        <div className="form_add_award_container__content__button">
                            <button type="submit">Add Post</button>
                        </div>
                        {error && <p className="error">{error}</p>}
                        </div>
                </form>
            </div> 
        </>
    )
}
export default Add_post;