import { createContext, useEffect, useReducer } from "react";
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
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  useEffect(() => {
    const checkToken = async () => {
      if (!state.user) return; 
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/checkToken`,
          { withCredentials: true }
        );

        if (!res.data.status) {
          localStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
        }
      } catch (err) {
        console.error("Token check failed:", err);
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
      }
    };

    checkToken();
  }, []); 

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
