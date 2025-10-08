import { createContext, useReducer, useEffect, useState } from "react";
import axios from "axios";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { user: null, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { user: action.payload, loading: false, error: null };
    case "LOGIN_FAILURE":
      return { user: null, loading: false, error: action.payload };
    case "LOGOUT":
      return { user: null, loading: false, error: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("/auth/checkToken", { withCredentials: true });
        if (res.data.status) {
          const userData = JSON.parse(localStorage.getItem("user"));
          if (userData) dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (err) {
        dispatch({ type: "LOGOUT" });
      } finally {
        setInitialized(true); 
      }
    };

    verifyUser();
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        initialized,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
