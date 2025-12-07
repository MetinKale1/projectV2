// import axios from 'axios';

// const baseUrl = 'http://localhost:9000/api/feedback';

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

// // Fetch all feedbacks
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

// // Fetch a single feedback by ID
// export const getById = async (id) => {
//   try {
//     const response = await axios.get(`${baseUrl}/${id}`, {
//       withCredentials: true, // Ensure credentials are sent with request
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error;
//   }
// };
import axios from 'axios';

const baseUrl = 'http://localhost:9000/api/feedback';

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

// Fetch all feedbacks
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

// Fetch a single feedback by ID
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

// Add a new feedback
export const addFeedback = async (feedback) => {
  try {
    const response = await axios.post(baseUrl, feedback, {
      withCredentials: true, // Ensure credentials are sent with request
    });
    return response.data;
  } catch (error) {
    console.error('Error adding feedback:', error);
    throw error;
  }
};