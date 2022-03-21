
import React from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../stylesheets/Nav.css";

function Nav() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)

  const logout = ()=>{
    dispatch({type: 'currentUser/logout'})
    navigate('/login')
  }


  if (currentUser) {
    return (
      <nav className='nav-wrapper'>
      <ul>
        <li className='nav-link' onClick={() => navigate('/lobby')}>Lobby</li>
        <li className='nav-link' onClick={() => navigate('/profile')}>Profile</li>
        <li className='nav-link' onClick={logout}>Logout</li>
      </ul>
    </nav>
    )
  }

  return (
    <nav className='nav-wrapper'>
      <ul>
        <li className='nav-link' onClick={() => navigate('/login')}>Login</li>
        <li className='nav-link' onClick={() => navigate('/signup')}>Sign Up</li>
      </ul>
    </nav>
  )
}

export default Nav