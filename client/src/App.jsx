import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage/Homepage.jsx'
import Chatbot from './pages/Chatbot/Chatbot.jsx'
import Guidelines from './pages/Guidelines/Guidelines.jsx'
import Schemes from './pages/Schemes/Schemes.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Scheme from './pages/Scheme/Scheme.jsx'
import Auth from './pages/Auth/Auth.jsx'
import VoiceAssistant from './pages/VoiceAssistent/VoiceAssistant.jsx'
import Guideline from './pages/Guideline/Guideline.jsx'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/'  element={<Homepage/>} />
        <Route path='/chatbot' element={<Chatbot/>} />
        <Route path='/guidelines' element={<Guidelines/>} />
        <Route path='/schemes' element={<Schemes/>} />
        <Route path='/schemes/:schemeId' element={<Scheme/> }/>
        <Route path='/profile' element={<Profile/>} />
        <Route path='/auth' element={<Auth/>} />
        <Route path="/voice-assistant" element={<VoiceAssistant/>}/>
        <Route path='/guidelines/:guidelineId' element={<Guideline/>} />
      </Routes>
    </div>
  )
}

export default App