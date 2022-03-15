
const setCurrentUser = async ()=>{
  let token = 'Bearer ' + localStorage.getItem('jwt')

  try {
    const res = axios.get(`${BASE_URL}/users/current`, {
      headers: {
        'Authorization': token
      }
    })

  } catch (err) {
    console.warn(err);
  }
}