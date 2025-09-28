import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets';
import './Schemes.css'
import SchemeCard from '../../components/SchemeCard/SchemeCard';
import axios from 'axios';
import GuidelineCard from '../../components/GuidelineCard/GuidelineCard';


const Schemes = () => {

    const [search,setSearch]=useState("");
    const [schemes,setSchemes]=useState([]);

   useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/getSchemes`;
        const { data } = await axios.get(url);
        setSchemes(data.data);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      }
    };

    fetchSchemes();
  }, []);


  return (
    <div className='schemes'>
        <div className="schemes-search-container">
            <h1>Available Schemes</h1>
            <p>Explore a wide range of government and private schemes designed to support farmers with subsidies, loans, insurance, and financial aid.</p>
            <div>
                <img src={assets.search_icon} />
                <input type="text" placeholder='Search schemes by name, category or benefits' value={search} onChange={(e)=>{setSearch(e.target.value)}} />
                <img src={assets.filter_icon}/>
            </div>
        </div>

        <div className="schemes-list">
            {
                schemes.map((scheme,index)=>{
                    return <SchemeCard imageUrl={scheme.imageUrl} shortDesc={scheme.shortDesc} title={scheme.title}  launchDate={scheme.launchDate} id={scheme._id}  key={index}/>
                })
            }

        </div>
    </div>
  )
}

export default Schemes