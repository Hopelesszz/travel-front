import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useState } from 'react';
import { Link } from "react-router-dom";

const SearchUsersModal = ({showUsers, setShowUsers,query}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [usersData,setUsersData] = useState([]);
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
    return (
        showUsers && (
                <div className="background">
                    <div className='users'>
                        <div>
                            <FontAwesomeIcon style={{left:"510px"}} onClick={onClose} className='closeComment' icon={faXmark} />
                            {usersData.length > 0 ? (
                            usersData.map((user) => (
                                user.avatar ? (
                                <Link key={user._id}  state={{ user: user }} style={{ textDecoration: "none" }} to="/other_account_info">
                                    <div className="user">
                                        <img src={user.avatar} alt="Profile" />
                                        <p>{user.username}</p>
                                    </div>
                                </Link>
                                ) : (
                                <Link key={user._id}  state={{ user: user }} style={{ textDecoration: "none" }} to="/other_account_info">
                                    <div className="user">
                                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Profile" />
                                        <p>{user.username}</p>
                                    </div>
                                </Link>
                                )
                            ))
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            )
        )
}

export default SearchUsersModal;