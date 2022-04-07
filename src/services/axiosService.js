import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bebe-api.herokuapp.com/api/",
});

axiosInstance.interceptors.request.use((req) => {
  req.headers = req.headers || {};
  req.headers.authorization = localStorage.getItem("token");

  return req;
});

export default axiosInstance;
