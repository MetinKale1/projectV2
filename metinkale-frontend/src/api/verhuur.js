// Update een verhuur (bijvoorbeeld inleverdatum aanpassen)
export const updateVerhuur = async (verhuurID, data) => {
  try {
    const response = await axios.put(`${baseUrl}/${verhuurID}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating verhuur:', error);
    throw error;
  }
};
// Annuleer een verhuur (verwijder)
export const cancelVerhuur = async (verhuurID) => {
  try {
    const response = await axios.delete(`${baseUrl}/${verhuurID}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling verhuur:', error);
    throw error;
  }
};
import axios from 'axios';

const baseUrl = 'http://localhost:9000/api/verhuur';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  console.log('Token being used:', token);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Fetch all verhuur
export const getAll = async () => {
  try {
    const response = await axios.get(baseUrl, {
      withCredentials: true,
    });
    return response.data.items || response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Fetch verhuur by klantID
export const getByKlantId = async (klantID) => {
  try {
    const response = await axios.get(`${baseUrl}/klant/${klantID}`, {
      withCredentials: true,
    });
    return response.data.items || response.data;
  } catch (error) {
    console.error('Error fetching data by klantID:', error);
    throw error;
  }
};

// Fetch a single verhuur by ID
export const getById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Add a new verhuur
export const addVerhuur = async (verhuur) => {
  try {
    const response = await axios.post(baseUrl, verhuur, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding verhuur:', error);
    throw error;
  }
};
