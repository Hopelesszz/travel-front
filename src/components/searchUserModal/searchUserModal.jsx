import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SearchUsersModal = ({showUsers, setShowUsers,query}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [usersData,setUsersData] = useState([]);
    const { user: loggedUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const onClose = () => {
        setShowUsers(false);
    };
    useEffect(()=>{
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_URL}/users/search?query=${query}`);
                setUsersData(res.data);
            } 
            catch (err) {
                console.error(err);
            }
        }
        if(query) {
            fetchUsers();
        }
    },[query]);
    const handleUserClick = (user, path) => {
        onClose();
        navigate(path, { state: { user } });
    };
    return (
        showUsers && (
                <div className="background">
                    <div className='users'>
                        <div>
                            <FontAwesomeIcon style={{left:"510px"}} onClick={onClose} className='closeComment' icon={faXmark} />
                           {usersData.length > 0 &&
                                usersData.map((user) => {
                                    const isCurrentUser = loggedUser?._id?.toString() === user._id?.toString();
                                    const avatar = user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                    return isCurrentUser ? (
                                    <div onClick={() => handleUserClick(user,"/account_info")} className="user">
                                        <img src={avatar} alt="Profile" />
                                        <p>{user.username}</p>
                                    </div>
                                    ) : (
                                    <div onClick={() => handleUserClick(user,"/other_account_info")} className="user">
                                        <img src={avatar} alt="Profile" />
                                        <p>{user.username}</p>
                                    </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )
        )
}

export default SearchUsersModal;