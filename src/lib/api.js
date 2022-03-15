import axios from 'axios'

const BASE_URL = 'http://localhost:9090'

export const login = (email, password) =>{

  const url = `${BASE_URL}/login`
  
  return axios.post(url, {email: email, password: password})

}

