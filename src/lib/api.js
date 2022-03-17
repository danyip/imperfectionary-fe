import axios from "axios";

// const BASE_URL = 'http://localhost:9090'

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://imperfectionary.herokuapp.com"
    : "http://localhost:9090";

export const login = (email, password) => {
  const url = `${BASE_URL}/login`;

  return axios.post(url, { email: email, password: password });
};

export const signUp = (username, email, password) => {
  const url = `${BASE_URL}/users/create`;

  return axios.post(url, { email: email, password: password });
};
