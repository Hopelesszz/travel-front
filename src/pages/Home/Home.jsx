import "./Home.scss";
import Header from "../../components/Header/Header";
import Posts from "../../components/Posts/Posts";
function Home () {
    return(
        <>
            <Header/>
            <Posts page={"main"}/>
        </>
    )
}
export default Home;