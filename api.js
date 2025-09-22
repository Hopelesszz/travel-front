import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8800", 
  withCredentials: true,
});

export const cloudinaryApi = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dhe6tnpg0",
  withCredentials: false,
});