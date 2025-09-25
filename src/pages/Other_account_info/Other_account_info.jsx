import React from 'react';
import Header from '../../components/Header/Header';
import { useLocation } from "react-router-dom";
import { useState,useEffect } from 'react';
import Posts from "../../components/Posts/Posts";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Other_account_info = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const initialUser = location.state.user;
    const [other_user, setOtherUser] = useState(initialUser);
    const [awards,setAwards] = useState([]);
    const [posts,setPosts] = useState([]);
    const { user,dispatch } = useContext(AuthContext);
    useEffect(() => {
    const fetchUser = async () => {
        try {
        const res = await axios.get(`${API_URL}/users/getOneUser/${initialUser._id}`, { withCredentials: true });
        setOtherUser(res.data);
        } catch (err) {
        console.error(err);
        }
    };
    fetchUser();
    }, [initialUser._id]);
    useEffect(() => {
        const fetchAwards = async () => {
            try {
                const res = await axios.get(`${API_URL}/awards/getAwardsByUser/${other_user._id}`, { withCredentials: true });
                setAwards(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${API_URL}/posts/getPostsByUser/${other_user._id}`, { withCredentials: true }); 
                setPosts(res.data);  
            } catch (err) {
                console.error(err);
            }
        };
        if (user?._id) {
            fetchAwards();
            fetchPosts();
        }
    }, [user._id]);
    const subscribe = async () => {
        try {
            const res = await axios.put(`${API_URL}/users/updateUser/${other_user._id}`, { followers: user._id, action: "add followers"}, { withCredentials: true });
            const res2 = await axios.put(`${API_URL}/users/updateUser/${user._id}`, { following: other_user._id, action: "add following"}, { withCredentials: true });
            localStorage.setItem("user", JSON.stringify(res2.data));
            dispatch({ type: "LOGIN_SUCCESS", payload: res2.data });  
            setOtherUser(res.data);
        }
        catch (err) {
            console.error(err);
        }
    }
    const unsubscribe = async () => {
        try {
            const res = await axios.put(`${API_URL}/users/updateUser/${other_user._id}`, { followers: user._id, action: "delete followers"}, { withCredentials: true });
            const res2 = await axios.put(`${API_URL}/users/updateUser/${user._id}`, { following: other_user._id, action: "delete following"}, { withCredentials: true });
            localStorage.setItem("user", JSON.stringify(res2.data));
            dispatch({ type: "LOGIN_SUCCESS", payload: res2.data });  
            setOtherUser(res.data);
        }
        catch (err) {
            console.error(err);
        }
    }
    return (
        <>
            <Header/>
            <div className="account_info">
                <div style={{height:"520px"}} className="account_info__photoContainer">
                    {other_user.avatar ?  
                        <img src={other_user.avatar} alt="avatar"/>
                    : 
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="avatar"/>
                    }
                    <div style={{height:"150px"}}>
                        <h2>{other_user.username}</h2>
                        <p id="email">{other_user.email}</p>
                        {other_user.followers.includes(user._id) ?
                            <button style={{backgroundColor:"red"}} onClick={unsubscribe} className="button">Unsubscribe</button>
                            :
                            <button onClick={subscribe} className="button">Subscribe</button>
                        }
                    </div>
                    <section>
                        <div>
                            <h2>{other_user.followers.length}</h2>
                            <p>followers</p>
                        </div>
                        <div>
                            <h2>{other_user.following.length}</h2>
                            <p>following</p>
                        </div>
                        <div>
                            <h2>{other_user.awards.length}</h2>
                            <p>awards</p>
                        </div>
                    </section>
                </div>
                <div className="account_info__achievements">
                    <h3>Achievements</h3>
                    {awards.length !== 0 ? (
                        <div>
                            {awards.map((award) => (
                            <section key={award._id}>
                                <p className="account_info__achievements__title">
                                    <strong>{award.title}</strong>
                                </p>
                                <span>{award.description}</span>
                                <h6>{award.progress.current}/{award.progress.target}</h6>
                                <pre className="progress-bar">
                                    <pre className="progress-bar-fill" style={{ width: `${(award.progress.current / award.progress.target) * 100}%` }}></pre>
                                </pre>
                            </section>
                            ))}
                        </div>
                    ) : (
                        <h2 id="no_data">There isn't a single achievement.</h2>
                    )}
                </div>
                <div className="account_info__posts">
                    {posts.length !== 0 ? (
                        <Posts otherUserId={other_user._id} page={"other_account_info"} />
                    ) : (
                        <>
                            <h3>Posts</h3>
                            <h2 id="no_data">There isn't a single post.</h2>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default Other_account_info;