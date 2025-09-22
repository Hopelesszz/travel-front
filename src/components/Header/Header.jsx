import "./Header.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas,faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
function Header () {
    const { user,dispatch } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    const logOut = async () => {
        await axios.post(`/auth/logout/${user._id}`);
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("user");
        navigate("/auth");
    }
    
    return(
        <div className="header">
            <div className="header_container">
                <div className="header_container__logo_container">
                    <FontAwesomeIcon className="logo" icon={faEarthAmericas} />
                    <h1>Travel</h1>
                </div>
                <nav>
                    <ul className="header_container__nav_links">
                        {location.pathname !== "/" && (
                            <Link className="link" to="/"><li>Home</li></Link>
                        )}
                        {!user ? 
                            <>
                                <Link className="link" to="/auth"><li>Sign In</li></Link>
                                <Link className="link" to="/register"><li>Sign Up</li></Link>    
                            </>
                        :
                            <></>
                        }
                    </ul>
                </nav>
                <div className="header_container__account">
                    {user && user.avatar ? 
                        <Link to="/account_info">
                            <div>
                                <img src={user.avatar} alt="avatar"/>
                                <span>{user.username}</span>
                            </div>
                        </Link>  
                    : user ?
                        <Link to="/account_info">
                            <div>
                                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="avatar"/>
                                <span>{user.username}</span>
                            </div>
                        </Link>  
                    :
                        <></>
                    }
                    {user ? 
                        <FontAwesomeIcon onClick={logOut} className="logout" icon={faRightFromBracket} />
                    : 
                        <></>
                    }
                </div>
                {user && location.pathname !== "/add_post" ? 
                    <Link to="/add_post"><button className="button">Add Post</button></Link>
                : 
                    <></>
                }    
            </div>
        </div>
    )
}
export default Header;