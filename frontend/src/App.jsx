import { useState } from 'react'

import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Authentication from './pages/authentication'
import { AuthProvider } from './contexts/AuthContext'
import VideoMeetComponent from './pages/VideoMeet'
import HomeComponent from './pages/Home.jsx'
import History from './pages/history'

function App() {
  

  return (
   <div className='App'>
      <Router>
        <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/auth' element={<Authentication/>}/>
          <Route path='/home' element={<HomeComponent/>}/>
          <Route path='/history' element={<History/>}/>
          <Route path='/:url' element={<VideoMeetComponent/>}/>
        </Routes>
        </AuthProvider>
      </Router>
      </div>  
    
  )
}

export default App
