import axios from "axios";
import { API_URL } from "./contants";

const instance = axios.create({
  baseURL: API_URL,
  params: {
    api_key: import.meta.env.VITE_API_KEY,
  },
});

export default instance;
