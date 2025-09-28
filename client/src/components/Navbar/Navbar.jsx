import React, { useState } from 'react'
import { assets } from '../../assets/assets.js'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../Context/UserContext.jsx'


const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className='navbar'>
            <div className="navbar-left" onClick={() => navigate('/')}>
                <img src={assets.leaf} alt="" />
                <p>Krishi Mitra</p>
            </div>
            <div className="menu-icon" onClick={toggleMenu}>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
            <div className={`navbar-right ${isMenuOpen ? 'active' : ''}`}>
                <div className="pages" onClick={() => { navigate('/chatbot'); setIsMenuOpen(false); }}>
                    <img src={assets.chatbot} alt="" />
                    <p>Chatbot</p>
                </div> 
                <div className="pages" onClick={() => { navigate('/voice-assistant'); setIsMenuOpen(false); }}>
                    <img src={assets.call} alt="" />
                    <p>voice assistant</p>
                </div>
                <div className="pages" onClick={() => { navigate('/guidelines'); setIsMenuOpen(false); }}>
                    <img src={assets.guidelines} alt="" />
                    <p>Guidelines</p>
                </div>
                <div className="pages" onClick={() => { navigate('/schemes'); setIsMenuOpen(false); }}>
                    <img src={assets.gift} alt="" />
                    <p>Schemes</p>
                </div>
                <div className="pages" onClick={() => { navigate(user ? '/profile' : '/auth'); setIsMenuOpen(false); }}>
                    <img src={assets.profile} alt="" />
                    <p>{user ? 'Profile' : 'Login'}</p>
                </div>
            </div>
        </div>
    )
}

export default Navbar