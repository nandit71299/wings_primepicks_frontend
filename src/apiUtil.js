import axios from "axios";

const API_HOST = import.meta.env.API_HOST || "http://localhost";
const API_PORT = import.meta.env.VITE_API_PORT || "3000"; // Default to port 3000 if not set
const API_URL = `${API_HOST}:${API_PORT}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000, // Timeout after 5 seconds
  headers: { "Content-Type": "application/json" },
});

export const getAllProductsByCategories = async () => {
  try {
    const response = await apiClient.get("/products/products-by-categories");
    return response.data; // Return the API response directly
  } catch (error) {
    // Improved error handling
    console.error("API error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data.message || "API request failed.",
    };
  }
};

export const loginApi = async ({ email, password }) => {
  try {
    const response = await apiClient.post(`${API_URL}/auth/login`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data.message || "API request failed.",
    };
  }
};

export const tokenVerificationApi = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await apiClient.post(
      `/auth/verification`,
      {}, // Send an empty object if no data is required
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data.message || "API request failed.",
    };
  }
};

export const getAllProducts = async (
  page,
  pageSize,
  category,
  search,
  sortByPrice
) => {
  try {
    const response = await apiClient.get("/products", {
      params: {
        page,
        page_size: pageSize,
        page,
        pageSize,
        category,
        name: search,
        sort_by_price: sortByPrice,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data.message || "API request failed.",
    };
  }
};

export const getAllCategories = async () => {
  try {
    const response = await apiClient.get("/products/getAllCategories");
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data.message || "API request failed.",
    };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data.message || "API request failed.",
    };
  }
};

export const getCartDetails = async (user_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await apiClient.get(`/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data.message || "API request failed.",
    };
  }
};

export const addToCart = async (prodId) => {
  console.log(`Adding ${JSON.stringify(prodId)}`);
  try {
    const token = localStorage.getItem("token");
    const response = await apiClient.post(
      `/cart/${prodId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data.message || "API request failed.",
    };
  }
};

export const deleteFromCart = async (prodId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await apiClient.delete(`/cart/${prodId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data.message || "API request failed.",
    };
  }
};
