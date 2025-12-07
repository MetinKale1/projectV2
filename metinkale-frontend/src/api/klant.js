import axios from 'axios';

const baseUrl = 'http://localhost:9000/api/klanten';

export const getKlantById = async (id) => {
	const response = await axios.get(`${baseUrl}/${id}`);
	return response.data;
};

export const updateKlantFoto = async (id, klantData) => {
	const response = await axios.put(`${baseUrl}/${id}`, klantData);
	return response.data;
};
