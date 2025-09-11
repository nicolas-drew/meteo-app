import { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        isInitialized: true,
      };
    case "ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
        isInitialized: true,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        loading: false,
        isInitialized: true,
      };
    case "INITIALIZE_COMPLETE":
      return {
        ...state,
        isInitialized: true,
        loading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Appliquer le thème basé sur les préférences utilisateur
  useEffect(() => {
    if (state.user?.preferences?.theme) {
      const theme = state.user.preferences.theme;
      if (theme === "auto") {
        // Détecter le thème système
        const systemDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        document.body.className = systemDarkMode ? "dark" : "light";
      } else {
        document.body.className = theme;
      }
    } else if (state.isInitialized && !state.isAuthenticated) {
      // Si pas connecté, utiliser le thème sauvegardé localement
      const savedTheme = localStorage.getItem("darkMode");
      const darkMode = savedTheme ? JSON.parse(savedTheme) : false;
      document.body.className = darkMode ? "dark" : "light";
    }
  }, [
    state.user?.preferences?.theme,
    state.isInitialized,
    state.isAuthenticated,
  ]);

  // Vérifier le token au chargement de l'app
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        dispatch({ type: "LOADING" });
        try {
          const data = await authAPI.getProfile();
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: data.user, token },
          });
        } catch (error) {
          console.error("Token invalide:", error);
          localStorage.removeItem("authToken");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        // Pas de token, on marque comme initialisé
        dispatch({ type: "INITIALIZE_COMPLETE" });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "LOADING" });
    try {
      const data = await authAPI.login(credentials);
      localStorage.setItem("authToken", data.token);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: data,
      });
      return data;
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "LOADING" });
    try {
      const data = await authAPI.register(userData);
      localStorage.setItem("authToken", data.token);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: data,
      });
      return data;
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.message,
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (userData) => {
    dispatch({
      type: "UPDATE_USER",
      payload: userData,
    });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
