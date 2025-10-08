import { HashRouter,Routes,Route, Navigate,BrowserRouter } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Registration from "./pages/Registration/Registration";
import Home from "./pages/Home/Home";
import Account_info from "./pages/Account_info/Account_info";
import ProtectedRoute from "./Protected_route";
import UserRoute from "./User_route";
import Edit_account from "./pages/Edit_account/Edit_account";
import Add_post from "./pages/Add_post/Add_post";
import { useEffect,useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";
import Other_account_info from "./pages/Other_account_info/Other_account_info.jsx";
import Edit_post from "./pages/Edit_post/Edit_post.jsx";


function AppRoutes() {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/checkToken`, { withCredentials: true });
        if (res.data.status === false) {
          dispatch({ type: "LOGOUT" });
          localStorage.removeItem("user");
          navigate("/auth");
        }
      } catch (err) {
        console.log(err);
      }
    };
    //checkToken();
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<UserRoute><Auth /></UserRoute>} />
      <Route path="/register" element={<UserRoute><Registration /></UserRoute>} />
      <Route path="/account_info" element={<ProtectedRoute><Account_info /></ProtectedRoute>} />
      <Route path="/account_info/edit_account" element={<ProtectedRoute><Edit_account /></ProtectedRoute>} />
      <Route path="/add_post" element={<ProtectedRoute><Add_post /></ProtectedRoute>} />
      <Route path="/other_account_info" element={<ProtectedRoute><Other_account_info/></ProtectedRoute>}/>
      <Route path="/edit_post" element={<ProtectedRoute><Edit_post/></ProtectedRoute>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
