import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/expenses';

const expenseService = {
  // Fetch all expenses with optional category filter
  getAll: async (category = '') => {
    const url = category && category !== 'All' 
      ? `${API_BASE_URL}?category=${encodeURIComponent(category)}`
      : API_BASE_URL;
    const response = await axios.get(url);
    return response.data;
  },

  // Fetch single expense by ID
  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Create new expense
  create: async (expenseData) => {
    const response = await axios.post(API_BASE_URL, expenseData);
    return response.data;
  },

  // Update existing expense
  update: async (id, expenseData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, expenseData);
    return response.data;
  },

  // Delete expense by ID
  delete: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  // Fetch summary statistics
  getSummary: async () => {
    const response = await axios.get(`${API_BASE_URL}/summary`);
    return response.data;
  }
};

export default expenseService;
