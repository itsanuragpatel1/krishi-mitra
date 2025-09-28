import React from 'react'
import './Hero.css'
import { assets } from '../../assets/assets'

const Hero = () => {
  return (
    <div className="Krishi-section">
        <div className="Krishi-icon"><img src={assets.leaf} alt="" /></div>
        <h1>Welcome to Krishi Mitra</h1>
        <p>
        Your AI-powered farming assistant. From crop care to government schemes,
        we help you improve your farming. 
        </p>
        <div className="Krishi-button-box">
        <a href="/chatbot" className="Krishi-btn chat">💬 Chat with the Chatbot</a>
        <a href="/voice-assistant" className="Krishi-btn guide">📞 Voice Assistent</a>
        </div>
  </div>
  )
}

export default Hero