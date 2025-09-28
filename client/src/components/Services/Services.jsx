import React from 'react'
import { services } from '../../assets/assets'
import ServicesCard from '../ServicesCard/ServicesCard'
import './Services.css'

const Services = () => {
  return (
    <div className='services'>
        <div className='services-upper'>
            <h1>Our Services</h1>
            <p>Krishi Mitra Connects you to modern farming techniques and government schemes</p>
        </div>
        <div className='services-list'>
            {
                services.map((ele,index)=>{
                    return <ServicesCard image={ele.image} title={ele.title} description={ele.description} key={index}/>
                })
            }
        </div>
    </div>
  )
}

export default Services