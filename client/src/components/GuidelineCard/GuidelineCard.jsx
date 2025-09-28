import React from 'react'
import './GuidelineCard.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const GuidelineCard = ({imageUrl,shortDesc,title,publishDate,id}) => {

    const navigate=useNavigate();

  return (
    <div className="guideline-card" onClick={()=>{navigate(`/guidelines/${id}`)}}  >
      <div className="guideline-img-wrapper">
        <img src={imageUrl || assets.test} alt="guideline" />
        <p className="date">{publishDate.slice(0,10)}</p>
      </div>

      <div className="guideline-lower">
        <h1 className="guideline-title">
          {title}
        </h1>
        <p className="guideline-desc">
          {shortDesc}
        </p>
      </div>
    </div>
  )
}

export default GuidelineCard
