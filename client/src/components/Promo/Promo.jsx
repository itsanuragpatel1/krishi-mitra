import React from 'react'
import './Promo.css'
import { Link } from 'react-router-dom'

const Promo = () => {


  return (
    <div className='promo'>
        <h1>Start your smart farming today</h1>
        <h2>Modernize your farming with Krishi Mitra and get better yields.</h2>
        <Link to={'/chatbot'}><button>Start Chat Now</button></Link>
    </div>
  )
}

export default Promo