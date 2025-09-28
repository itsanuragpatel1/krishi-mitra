import React from 'react'
import './SchemeCard.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SchemeCard = ({imageUrl,title,shortDesc,launchDate,id}) => {
  const navigate=useNavigate()

  return (
    <div className="scheme-card" onClick={()=>(navigate(`/schemes/${id}`))}>
      <div className="scheme-img-wrapper">
        <img src={imageUrl|| assets.test} alt="scheme" />
        <p className="date">{launchDate.slice(0,10)}</p>
      </div>

      <div className="scheme-lower">
        <h1 className="scheme-title">
         {title}
        </h1>
        <p className="scheme-desc">
          {shortDesc}
        </p>
      </div>
    </div>
  )
}


export default SchemeCard
