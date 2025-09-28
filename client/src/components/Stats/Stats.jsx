import React from 'react'
import './Stats.css'
import { stats } from '../../assets/assets';

const Stats = () => {

  return (
    <div className="stats-section">
      {stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-icon"><img src={stat.icon} alt="" /></div>
          <h2 className="stat-value">{stat.value}</h2>
          <p className="stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default Stats