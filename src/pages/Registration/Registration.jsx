import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Registration.scss"
import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../../context/AuthContext.jsx";
function Registration () {
    const API_URL = import.meta.env.VITE_API_URL;
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");   
    const [password,setPassword] = useState("");
    const [error, setError] = useState("");
    const [show,setShow] = useState(false);
    const [repeatedPassword,setRepeatedPassword] = useState(undefined);
    const [show2,setShow2] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);

    const addUser = async (e) => {
        e.preventDefault(); 
        try {
            if (password !== repeatedPassword) {
                throw new Error("Passwords do not match");
            }
            await axios.post(`${API_URL}/auth/register`, {
                username: username,
                email: email,
                password: password,
                isAdmin: false,
            });
            dispatch({ type: "LOGIN_START" });
            const res = await axios.post(`${API_URL}/auth/login`, {username, password});
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
            navigate("/");
        }
        catch (error) {
            if (error.response) {
                setError(error.response.data.message); 
            } 
            else {
                setError(error.message || "Something went wrong!");
            }
        }
    }

    return(
        <>
            <Header/>
            <div className="form_reg_container">
                <form onSubmit={addUser}>
                    <h2>Sign Up</h2>
                    <div className="form_container__content">
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
                        <div className="form_container__content__field">
                            <label htmlFor="repeated_password">Confirm Password</label>
                            <div>
                                {show2 ?
                                    <input onChange={(e) => setRepeatedPassword(e.target.value)} type="text" id="repeated_password" name="repeated_password" required />   
                                    :
                                    <input onChange={(e) => setRepeatedPassword(e.target.value)} type="password" id="repeated_password" name="repeated_password" required />
                                }
                                {show2 ?
                                    <FontAwesomeIcon onClick={() => setShow2(false)} className="eye" icon={faEye} />
                                :
                                    <FontAwesomeIcon onClick={() => setShow2(true)} className="eye" icon={faEyeSlash} />
                                }
                            </div>
                        </div>
                        <div className="form_container__content__field">
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" required />
                        </div>
                        <div className="form_container__content__button">
                            <button type="submit">Sign Up</button>
                            <p>Do you have an account? <Link to="/auth"><strong>Sing in</strong></Link></p>
                        </div>
                        {error && <p className="error">{error}</p>}
                    </div>
                </form>
            </div>
        </>
    )
}
export default Registration;