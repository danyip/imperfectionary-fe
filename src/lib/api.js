import axios from "axios";


export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://imperfectionary.herokuapp.com"
    : "http://localhost:9090";


export const login = (email, password) => {
  
  const url = `${BASE_URL}/login`;
  return axios.post(url, { email: email, password: password });
};

export const signup = (username, email, password) => {
  
  const url = `${BASE_URL}/users/create`;
  return axios.post(url, { username: username, email: email, password: password });
};

export const update = (username, email, password, token) => {
  
  const url = `${BASE_URL}/users/update`;
  return axios.post(url, { username: username, email: email, password: password }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

