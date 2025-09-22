import React from 'react'
import Header from '../../components/Header/Header';
import axios from "axios";
import "./Add_award.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Add_award = () => {
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");   
    const [target,setTarget] = useState(0);
    const [error, setError] = useState("");
    const { user,dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    

    const addAward = async (e) => {
        e.preventDefault(); 
        try {
            const award = await axios.post("/awards/addAward", {
                userId: user._id,
                title: title,
                description:description,
                progress: {
                  current: 0,
                  target: target
                },
                status: "in-progress"
            });
            const res = await axios.put(`/users/updateUser/${user._id}`, { awardId: award.data._id, action: "default update"});
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
      <div className="form_add_award_container">
        <form onSubmit={addAward}>
          <h2>Add Achievement</h2>
            <div className="form_add_award_container__content">
                <div className="form_container__content__field">
                  <label htmlFor="title">Title</label>
                  <input onChange={(e) => setTitle(e.target.value)} type="text" id="title" name="title" required />
                </div>
                <div className="form_container__content__field">
                  <label htmlFor="target">Target</label>
                  <input onChange={(e) => setTarget(e.target.value)} type="number" id="target" name="target" min="0" required />
                </div>
                <div style={{ height: "200px" }} className="form_container__content__field">
                  <label htmlFor="description">Description</label>
                  <textarea onChange={(e) => setDescription(e.target.value)} id="description" name="description" required></textarea>
                </div>
                <div className="form_add_award_container__content__button">
                  <button type="submit">Add Achievement</button>
                </div>
                  {error && <p className="error">{error}</p>}
                </div>
          </form>
      </div>        
    </>
  )
}
export default Add_award;