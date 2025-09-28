import React from 'react'
import './ServicesCard.css'

const ServicesCard = ({image,title,description}) => {
  return (
    <div className="info-card">
      <div className="info-card-icon">
        <img src={image} alt={title} />
      </div>
      <h3 className="info-card-title">{title}</h3>
      <p className="info-card-description">{description}</p>
    </div>
  )
}

export default ServicesCard