import "./Account_info.scss";
import Header from "../../components/Header/Header.jsx";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import Posts from "../../components/Posts/Posts";

function Account_info () {
    const API_URL = import.meta.env.VITE_API_URL;
    const { user,dispatch } = useContext(AuthContext);
    const [awards,setAwards] = useState([]);
    const [posts,setPosts] = useState([]);
    const [action, setAction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [awardId, setAwardId] = useState(null);
    
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAwards = async () => {
            try {
                const res = await axios.get(`${API_URL}/awards/getAwardsByUser/${user._id}`, { withCredentials: true });
                setAwards(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${API_URL}/posts/getPostsByUser/${user._id}`, { withCredentials: true }); 
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
    const modalAsk = (awardId) => {
        setShowModal(true);
        setAwardId(awardId);
    }
    const deleteAward = async (awardId) => { 
        try {            
            await axios.delete(`${API_URL}/awards/deleteAward/${awardId}`, { withCredentials: true });
            const res = await axios.put(`${API_URL}/users/updateUser/${user._id}`, { awardId: awardId, action:"delete award" }, { withCredentials: true });
            setAwards(prev => prev.filter(a => a._id !== awardId));
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });  
            navigate("/account_info");
        } catch (err) {
            console.error(err);
        }
    }
     
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
                        <div>
                            <h2>{user.followers.length}</h2>
                            <p>followers</p>
                        </div>
                        <div>
                            <h2>{user.following.length}</h2>
                            <p>following</p>
                        </div>
                        <div>
                            <h2>{user.awards.length}</h2>
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
                                    <FontAwesomeIcon onClick={() => {modalAsk(award._id)}} id="delete" icon={faXmark} />
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
                    <Link to="/add_award"><button className="button">Add Achievement</button></Link>
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
                {showModal && (
                    <Modal 
                        itemName="achievement" 
                        action={action} 
                        setAction={setAction} 
                        showModal={showModal} 
                        setShowModal={setShowModal} 
                        item={awardId}
                        deleteItem={deleteAward}
                    />
                )}
            </div>
        </>
    )
}
export default Account_info;