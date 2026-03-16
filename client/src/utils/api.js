const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol || "http:";
    const hostname = window.location.hostname || "localhost";
    return `${protocol}//${hostname}:5000/api`;
  }

  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();
const EDIT_TOKEN_KEY_PREFIX = "emergency_edit_token:";

const getEditTokenKey = (id) => `${EDIT_TOKEN_KEY_PREFIX}${id}`;

class ApiService {
  async checkHealth() {
    try {
      const healthUrl = API_BASE_URL.replace("/api", "/api/health");
      const response = await fetch(healthUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return { healthy: false, error: "Server not responding" };
      }

      const data = await response.json();
      return { healthy: true, data };
    } catch (error) {
      console.error("Health check failed:", error);
      return { healthy: false, error: error.message };
    }
  }

  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = data.error || "Failed to create emergency profile";

        // Include detailed validation errors if available
        if (data.details && Array.isArray(data.details)) {
          errorMessage += ": " + data.details.join(", ");
        }

        console.error("API Error Details:", data);
        throw new Error(errorMessage);
      }

      if (data?.data?.uniqueId && data?.data?.editToken) {
        localStorage.setItem(
          getEditTokenKey(data.data.uniqueId),
          data.data.editToken,
        );
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch emergency profile");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const editToken = localStorage.getItem(getEditTokenKey(id));
      if (!editToken) {
        throw new Error(
          "Edit authorization missing. Please use the same device/browser used to create this profile.",
        );
      }

      const response = await fetch(`${API_BASE_URL}/users/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${editToken}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update emergency profile");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Utility method to validate phone number
  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  }

  // Utility method to format phone number for display
  formatPhone(phone) {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }
}

export default new ApiService();
