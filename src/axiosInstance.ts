import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/sook!", // Mettez ici l'URL de votre API backend
});

export default axiosInstance;
