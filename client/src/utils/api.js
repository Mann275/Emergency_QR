const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname || "localhost";
    const isLocalHost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    // While developing locally, always hit local backend by default.
    if (isLocalHost) {
      return "http://localhost:5000/api";
    }
  }

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();
const EDIT_TOKEN_KEY_PREFIX = "emergency_edit_token:";
const API_BASE_NO_API_SUFFIX = API_BASE_URL.replace(/\/api\/?$/, "");

const getEditTokenKey = (id) => `${EDIT_TOKEN_KEY_PREFIX}${id}`;

const unique = (values) => [...new Set(values.filter(Boolean))];

const buildForgotPasswordRequestUrls = () =>
  unique([
    `${API_BASE_URL}/users/auth/forgot-password/request`,
    `${API_BASE_URL}/auth/forgot-password/request`,
    `${API_BASE_NO_API_SUFFIX}/api/users/auth/forgot-password/request`,
    `${API_BASE_NO_API_SUFFIX}/api/auth/forgot-password/request`,
    `${API_BASE_NO_API_SUFFIX}/users/auth/forgot-password/request`,
    `${API_BASE_NO_API_SUFFIX}/auth/forgot-password/request`,
  ]);

const buildForgotPasswordResetUrls = () =>
  unique([
    `${API_BASE_URL}/users/auth/forgot-password/reset`,
    `${API_BASE_URL}/auth/forgot-password/reset`,
    `${API_BASE_NO_API_SUFFIX}/api/users/auth/forgot-password/reset`,
    `${API_BASE_NO_API_SUFFIX}/api/auth/forgot-password/reset`,
    `${API_BASE_NO_API_SUFFIX}/users/auth/forgot-password/reset`,
    `${API_BASE_NO_API_SUFFIX}/auth/forgot-password/reset`,
  ]);

const buildForgotPasswordVerifyUrls = () =>
  unique([
    `${API_BASE_URL}/users/auth/forgot-password/verify`,
    `${API_BASE_URL}/auth/forgot-password/verify`,
    `${API_BASE_NO_API_SUFFIX}/api/users/auth/forgot-password/verify`,
    `${API_BASE_NO_API_SUFFIX}/api/auth/forgot-password/verify`,
    `${API_BASE_NO_API_SUFFIX}/users/auth/forgot-password/verify`,
    `${API_BASE_NO_API_SUFFIX}/auth/forgot-password/verify`,
  ]);

const readJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const postWithFallbackUrls = async ({ urls, body, fallbackErrorMessage }) => {
  let sawNotFound = false;
  let lastNetworkError = null;

  for (const url of urls) {
    let response;

    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      lastNetworkError = error;
      continue;
    }

    const data = await readJsonSafe(response);

    if (response.ok) {
      return data || { success: true };
    }

    if (response.status === 404) {
      sawNotFound = true;
      continue;
    }

    throw new Error(
      data?.message || data?.error || fallbackErrorMessage || "Request failed.",
    );
  }

  if (sawNotFound) {
    throw new Error(
      "Forgot-password route not found on server. Please redeploy backend latest code.",
    );
  }

  throw lastNetworkError || new Error(fallbackErrorMessage || "Request failed.");
};

class ApiService {
  hasEditToken(id) {
    if (!id) return false;
    return Boolean(localStorage.getItem(getEditTokenKey(id)));
  }

  getEditToken(id) {
    if (!id) return null;
    return localStorage.getItem(getEditTokenKey(id));
  }

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
      const editToken = this.getEditToken(id);
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

  async requestPasswordResetOtp(email) {
    try {
      return await postWithFallbackUrls({
        urls: buildForgotPasswordRequestUrls(),
        body: { email },
        fallbackErrorMessage: "Failed to send OTP.",
      });
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async resetPasswordWithOtp({ email, otp, newPassword }) {
    try {
      return await postWithFallbackUrls({
        urls: buildForgotPasswordResetUrls(),
        body: { email, otp, newPassword },
        fallbackErrorMessage: "Failed to reset password.",
      });
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async verifyPasswordResetOtp({ email, otp }) {
    try {
      return await postWithFallbackUrls({
        urls: buildForgotPasswordVerifyUrls(),
        body: { email, otp },
        fallbackErrorMessage: "Failed to verify OTP.",
      });
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
