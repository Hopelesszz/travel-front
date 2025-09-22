import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./Auth.scss";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
function Auth () {
    const [username,setUsername] = useState(undefined);
    const [password,setPassword] = useState(undefined);
    const { loading, error, dispatch } = useContext(AuthContext);
    const [show,setShow] = useState(false);
    const navigate = useNavigate();
    const authClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post("/auth/login", {username, password});
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
            navigate("/");
        } 
        catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload:  err.response.data });
        }
    };
    
    return(
        <>
            <Header/>
            <div className="form_container">
                <form>
                    <h2>Sign In</h2>
                    <div className="form_container__content_auth">
                        <div className="form_container__content__field">
                            <label htmlFor="username">Username</label>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" required />
                        </div>
                        <div className="form_container__content__field">
                            <label htmlFor="password">Password</label>
                            <div>
                                {show ?
                                    <input onChange={(e) => setPassword(e.target.value)} type="text" id="password" name="password" required />   
                                    :
                                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" required />
                                }
                                {show ?
                                    <FontAwesomeIcon onClick={() => setShow(false)} className="eye" icon={faEye} />
                                :
                                    <FontAwesomeIcon onClick={() => setShow(true)} className="eye" icon={faEyeSlash} />
                                }
                            </div>
                        </div>
                        <div className="form_container__content__button">
                            <button disabled={loading} onClick={authClick} type="submit">Sign In</button>
                            <p>Don't have an account? <Link to="/register"><strong>Sing up</strong></Link></p>
                        </div>
                       {error && (
                            <span className="error">
                                {typeof error === "string"
                                ? error
                                : error.message || error.status || "Unknown error"}
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </>
    )
}
export default Auth;
