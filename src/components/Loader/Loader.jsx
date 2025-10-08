import React from 'react';
import "./Loader.scss";

const Loader = ({color}) => {
  return (
    <div className="loader__wrapper">
      <div
        className="loader__spinner"
        style={{
          width: "60px",
          height: "60px",
          borderColor: `#3498db transparent #3498db transparent`,
        }}
      ></div>
      <p style={{color:color}} className="loader__text">Loading ...</p>
    </div>
  )
}
export default Loader;
