import axios from 'axios';

const baseUrl = 'http://localhost:9000/api/locaties';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');  // Get token from localStorage or context
  console.log('Token being used:', token);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Add Bearer token to headers
  }

  return config; // Return the config to continue with the request
}, (error) => {
  return Promise.reject(error); // If the request fails, reject the promise
});

// Now you can call your API without manually adding the token
export const getAll = async () => {
  try {
    const response = await axios.get(baseUrl, {
      withCredentials: true, // Ensure credentials are sent with request
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
// Fetch a single locatie by ID
export const getById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`, {
      withCredentials: true, // Ensure credentials are sent with request
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
// Add a new locatie
export const addLocatie = async (locatie) => {
  try {
    const response = await axios.post(baseUrl, locatie, {
      withCredentials: true, // Ensure credentials are sent with request
    });
    return response.data;
  } catch (error) {
    console.error('Error adding locatie:', error);
    throw error;
  }
};
