// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000'
});

// Bisección
export const calculateBisection = (params) => API.post('/bisection', params);

//Newton 
export const calculateNewton = (params) => API.post('/newton', params); 




export default API;
