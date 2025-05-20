// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000'
});

// Bisección
export const calculateBisection = (params) => API.post('/bisection', params);

//Newton 
export const calculateNewton = (params) => API.post('/newton', params); 

//Fixed point
export const calculateFixedPoint = (params) => API.post('/fixed_point', params);

//Help section
export const calculateHelp = (params) => API.post('/help', params);

//secante
export const calculateSecant = (params) => API.post('/Secant', params);

//Gauss-Seidel
export const calculateGaussSeidel = (params) => API.post('/system-of-equations/gauss-seidel', params);

//SOR
export const calculateSOR = (params) => API.post('/system-of-equations/sor', params);

//Jacobi
export const calculateJacobi = (params) => API.post('/system-of-equations/jacobi', params);

//Lagrange
export const calculateLagrange = (params) => API.post('/system-of-equations/lagrange', params);

export default API;
