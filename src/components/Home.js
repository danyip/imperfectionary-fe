import React from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Nav from './Nav'
import "../stylesheets/Home.css";

function Home() {

  const navigate = useNavigate()

  return (
    <div>
    <header>
      <h1 className='main-logo' onClick={() => navigate('/')}>imperfectionary</h1>
      <Nav/>
    </header>
      
      <div className='content-wrapper'>
      <Outlet />
      </div>

      
    </div>
  )
}

export default Home   