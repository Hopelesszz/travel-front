import "./Header.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas,faRightFromBracket,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
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
                        {location.pathname !== "/" ? (
                            <Link className="link" to="/"><li>Home</li></Link>
                        ) : (
                            <Link style={{textDecoration:"underline"}} className="link" to="/"><li>Home</li></Link>
                        )}
                        {location.pathname !== "/auth" ? (
                            <Link className="link" to="/auth"><li>Sign In</li></Link>
                        ) : (
                            <Link style={{textDecoration:"underline"}} className="link" to="/auth"><li>Sign In</li></Link>
                        )}
                        {location.pathname !== "/register" ? (
                            <Link className="link" to="/register"><li>Sign Up</li></Link>
                        ) : (
                            <Link style={{textDecoration:"underline"}} className="link" to="/register"><li>Sign Up</li></Link>
                        )}
                            
                    </ul>
                </nav>
                <form className="search_form">
                    <div className="search">
                        <FontAwesomeIcon className="search__icon" icon={faMagnifyingGlass} />
                        <input className="search__input" type="search" placeholder="Search User"/>
                    </div>
                </form>
                <div className="header_container__account">
                    {user && user.avatar ? 
                        <Link to="/account_info">
                            <div style={{gap:"10px"}}>
                                <img src={user.avatar} alt="avatar"/>
                                <span>{user.username}</span>
                            </div>
                        </Link>  
                    : user ?
                        <Link to="/account_info">
                            <div style={{gap:"10px"}}>
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