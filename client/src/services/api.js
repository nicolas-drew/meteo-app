const API_BASE_URL = "/api";

// Configuration pour les requêtes
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("authToken");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Si token expiré, nettoyer le localStorage
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      throw new Error(data.message || "Erreur API");
    }

    return data;
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};

// Services d'authentification
export const authAPI = {
  register: async (userData) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return apiRequest("/auth/profile");
  },
};

// Services utilisateur
export const userAPI = {
  updateProfile: async (userData) => {
    return apiRequest("/user/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  addFavoriteCity: async (cityData) => {
    return apiRequest("/user/favorites", {
      method: "POST",
      body: JSON.stringify(cityData),
    });
  },

  removeFavoriteCity: async (cityId) => {
    return apiRequest(`/user/favorites/${cityId}`, {
      method: "DELETE",
    });
  },

  getFavoriteCities: async () => {
    return apiRequest("/user/favorites");
  },

  updatePreferences: async (preferences) => {
    return apiRequest("/user/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });
  },

  deleteAccount: async () => {
    return apiRequest("/user/account", {
      method: "DELETE",
    });
  },
};
