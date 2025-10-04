import "./Account_info.scss";
import Header from "../../components/Header/Header.jsx";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from "../../components/Modal/Modal";
import Posts from "../../components/Posts/Posts";
import UsersModal from "../../components/UsersModal/UsersModal.jsx";

function Account_info () {
    const API_URL = import.meta.env.VITE_API_URL;
    const { user } = useContext(AuthContext);
    const [userAwards,setUserAwards] = useState([]);
    const [awards,setAwards] = useState([]);
    const [posts,setPosts] = useState([]);
    const [showUsers,setShowUsers] = useState(false);
    const [users,setUsers] = useState(null);
    
    useEffect(() => {
        const fetchAwards = async () => {
            try {
                const awardData = [];
                const res = await axios.get(`${API_URL}/userAward/getUserAwardsByUser/${user._id}`);
                setUserAwards(res.data);
                await Promise.all(
                    res.data.map( async (el) => {
                        const res2 = await axios.get(`${API_URL}/awards/getOneAward/${el.achievementId}`);
                        awardData.push(res2.data);
                    })
                );
                setAwards(awardData);
            } catch (err) {
                console.error(err);
            }
        };
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${API_URL}/posts/getPostsByUser/${user._id}`); 
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
    const completed = userAwards.filter((ua) => ua.completed === true);
    return(
        <>
            <Header/>
            <div className="account_info">
                <div className="account_info__photoContainer">
                    <div className="button-wrapper">
                        <Link to="/account_info/edit_account"><button className="button">Edit Profile</button></Link>
                    </div>
                    {user.avatar ?  
                        <img src={user.avatar} alt="avatar"/>
                    : 
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="avatar"/>
                    }
                    <div>
                        <h2>{user.username}</h2>
                        <p id="email">{user.email}</p>
                    </div>
                    <section>
                        <div style={{cursor:"pointer"}} onClick={()=>{setShowUsers(true); setUsers(user.followers)}}>
                            <h2>{user.followers.length}</h2>
                            <p>followers</p>
                        </div>
                        <div style={{cursor:"pointer"}} onClick={()=>{setShowUsers(true); setUsers(user.following)}}>
                            <h2>{user.following.length}</h2>
                            <p>following</p>
                        </div>
                        <div >
                            <h2>{completed.length}</h2>
                            <p>awards</p>
                        </div>
                    </section>
                </div>
                <div className="account_info__achievements">
                    <h3>Achievements</h3>
                   {awards.length !== 0 ? (
                    <div>
                        {awards.map((award) => {
                            const userAward = userAwards.find((ua) => ua.achievementId === award._id);
                            console.log(userAward);
                            const progress = userAward.progress;
                            const status = userAward.completed ? "Completed" : "In progress";
                            const percent = Math.min((progress / award.target) * 100, 100);
                            return (
                                <section key={award._id}>
                                <p className="account_info__achievements__title">
                                    <strong>{award.title}</strong>
                                </p>
                                <span>{award.description}</span>
                                <h6>{progress}/{award.target}</h6>
                                <pre className="progress-bar">
                                    <pre className="progress-bar-fill" style={{ width: `${percent}%` }}></pre>
                                </pre>
                                <h6>{status}</h6>
                                </section>
                            );
                        })}
                    </div>
                    ) : (
                        <h2 id="no_data">There isn't a single achievement.</h2>
                    )}
                </div>
                <div className="account_info__posts">
                    {posts.length !== 0 ? (
                        <Posts page={"account_info"} />
                    ) : (
                        <>
                            <h3>Posts</h3>
                            <h2 id="no_data">There isn't a single post.</h2>
                        </>
                    )}
                </div>
                {showUsers && (
                    <UsersModal 
                        showUsers={showUsers}
                        setShowUsers={setShowUsers}
                        usersIds={users}
                    />
                )}
            </div>
        </>
    )
}
export default Account_info;
