import "./Home.scss";
import Header from "../../components/Header/Header";
import Posts from "../../components/Posts/Posts";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
function Home () {
    return(
        <>
            <Header/>
            <Posts page={"main"}/>
        </>
    )
}
export default Home;