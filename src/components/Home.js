import React from 'react'
import { Outlet, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate()
  return (
    <div>
    <header>
      <h1>imperfectionary</h1>
      <nav>
        <div onClick={() => navigate('/draw')}>Draw</div>
        <div onClick={() => navigate('/guess')}>Guess</div>
      </nav>
    </header>
      <Outlet/>
    </div>
  )
}

export default Home   