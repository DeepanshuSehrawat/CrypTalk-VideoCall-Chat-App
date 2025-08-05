import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

import '../App.css'
export default function LandingPage() {
  const router=useNavigate();
  return (
    <div className='landingPageContainer'>
      <nav>
        <div className='navHeader'>
          {/* <h2>CrypTalk</h2> */}
          <img src='/image1.png' alt='logo'/>
        </div>
        <div className='navlist'>
          <p onClick={()=>{
            router("/d32u8982dndo3u94023")
          }}>Join as Guest</p>
          <p onClick={()=>{
            router("/auth")
          }}>Register</p>
          <div role='button'>
            <p onClick={()=>{
            router("/auth")
          }}>Login</p>
          </div>
        </div>
      </nav>
      <div className="landingMainContainer">
        <div><h1><span style={{color:"orange"}}>Connect </span>with loved ones</h1>
        <p>Cover a distance by CrypTalk</p>
        <div role='button'>
          <Link to='/auth'>Get Started</Link>
        </div>
        </div>
        <div>
          <img src='/mobile.png'></img>
        </div>
      </div>
      <footer className="footer">
      <p>Made with <span className="fire">🔥</span> by <strong>Deepanshu Sehrawat</strong></p>
    </footer>
    </div>
  )
}
