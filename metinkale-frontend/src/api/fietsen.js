// import axios from 'axios';

// const baseUrl = 'http://localhost:9000/api/fietsen';

// axios.interceptors.request.use((config) => {
//   const token = localStorage.getItem('jwtToken');  // Get token from localStorage or context
//   console.log('Token being used:', token);
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`; // Add Bearer token to headers
//   }

//   return config; // Return the config to continue with the request
// }, (error) => {
//   return Promise.reject(error); // If the request fails, reject the promise
// });

// // Fetch all fietsen
// export const getAll = async () => {
//   try {
//     const response = await axios.get(baseUrl, {
//       withCredentials: true, // Ensure credentials are sent with request
//     });
//     return response.data.items || response.data; // Ensure the response is an array
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// };
import axios from 'axios';

const baseUrl = 'http://localhost:9000/api/fietsen';

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

// Fetch all fietsen
export const getAll = async () => {
  try {
    const response = await axios.get(baseUrl, {
      withCredentials: true, // Ensure credentials are sent with request
    });
    return response.data.items || response.data; // Ensure the response is an array
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Fetch a single fiets by ID
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
// // Add a new locatie
// export const addFiets = async (fiets) => {
//   try {
//     const response = await axios.post(baseUrl, fiets, {
//       withCredentials: true, // Ensure credentials are sent with request
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error adding fiets:', error);
//     throw error;
//   }
// };
// Add a new fiets
export const addFiets = async (fiets) => {
  try {
    const response = await axios.post(baseUrl, fiets, {
      withCredentials: true, // Ensure credentials are sent with request
    });
    return response.data;
  } catch (error) {
    console.error('Error adding fiets:', error);
    throw error;
  }
};
// Update een fiets (status, locatie, ...)
export const updateFiets = async (fietsID, data) => {
  try {
    const response = await axios.put(`${baseUrl}/${fietsID}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating fiets:', error);
    throw error;
  }
};