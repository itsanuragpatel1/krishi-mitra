import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'
import Services from '../../components/Services/Services'
import Stats from '../../components/Stats/Stats'
import Promo from '../../components/Promo/Promo'

const Homepage = () => {
  return (
    <div>
        {/* <Navbar/> */}
        <Hero/>
        <Services/>
        <Stats/>
        <Promo/>
    </div>
  )
}

export default Homepage