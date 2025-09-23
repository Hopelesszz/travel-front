import React from 'react';
import Header from '../../components/Header/Header';
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import "./Edit_account.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Edit_account() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { user,dispatch } = useContext(AuthContext);
    const [file, setFile] = useState("");
    const [username,setUsername] = useState(user.username || "");
    const [email,setEmail] = useState(user.email || "");   
    const [error, setError] = useState("");
    const navigate = useNavigate();
    

    const editUser = async (e) => {
        e.preventDefault(); 
        try {
            let uploadRes;
            if(file) {
                const data = new FormData();
                data.append("file", file);
                data.append("upload_preset", "upload");
                uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dhe6tnpg0/image/upload", data, { withCredentials: false });
            }
            
            const url = uploadRes?.data.url || null;
            let editedUser;
            if (url === null) {
                editedUser = {
                    avatar: user.avatar,
                    username: username,
                    email: email,
                    action: "default update"
                }
            }
            else {
                editedUser = {
                    avatar: url,
                    username: username,
                    email: email,
                    action: "default update"
                }
            }
            const res = await axios.put(`${API_URL}/users/updateUser/${user._id}`, editedUser); 
            localStorage.setItem("user", JSON.stringify(res.data));
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });  
            navigate("/account_info");
        }
        catch (error) {
            if (error.response) {
                setError(error.response.data.message); 
            } else {
                setError("Something went wrong!");
            }
        }
    }
    return (
        <>
        <Header/>
            <div className="form_edit_container">
                <form onSubmit={editUser}>
                    <h2>Edit information</h2>
                    <div className="form_edit_container__content">
                        <div className="form_container__content__field">
                            <label>Avatar</label>
                            <label htmlFor="avatar"><FontAwesomeIcon className='upload_photo' icon={faImage} /></label>
                            <input onChange={(e) => setFile(e.target.files[0])} type="file" id="avatar" name="avatar" style={{ display: "none" }} />
                        </div>
                        <div className="form_container__content__field">
                            <label htmlFor="username">Username</label>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" value={username} required />
                        </div>
                        <div className="form_container__content__field">
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" value={email} required />
                        </div>
                        <div className="form_container__content__button">
                            <button type="submit">Edit</button>
                            <p>Do you want to go back to profile <Link to="/account_info"><strong>Account</strong></Link></p>
                        </div>
                        {error && <p className="error">{error}</p>}
                    </div>
                </form>
            </div>
        </>    
    )
}

