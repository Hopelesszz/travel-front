import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const { user, dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/checkToken`, {
          withCredentials: true,
        });

        if (res.data.status === false) {
          dispatch({ type: "LOGOUT" });
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.log("Token check error:", err);
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [dispatch, API_URL]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;