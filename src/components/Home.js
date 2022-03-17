import React from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


function Home() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logout = ()=>{
    dispatch({type: 'currentUser/logout'})
    navigate('/login')
  }

  return (
    <div>
    <header>
      <h1>imperfectionary</h1>
      <nav>
        <ul>
          <li onClick={() => navigate('/login')}>Login</li>
          <li onClick={() => navigate('/signup')}>Signup</li>
          <li onClick={() => navigate('/lobby')}>Lobby</li>
          <li onClick={() => navigate('/draw')}>Draw</li>
          <li onClick={() => navigate('/guess')}>Guess</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </nav>
    </header>
      <Outlet/>
    </div>
  )
}

export default Home   