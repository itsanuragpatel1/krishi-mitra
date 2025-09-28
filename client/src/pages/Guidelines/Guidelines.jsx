import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import './Guidelines.css'
import GuidelineCard from '../../components/GuidelineCard/GuidelineCard'
import axios from 'axios'

const Guidelines = () => {

    const [search,setSearch]=useState('')
    const [guidelines,setGuidelines]=useState([]);
    
       useEffect(() => {
        const fetchSchemes = async () => {
          try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/getGuidelines`;
            const { data } = await axios.get(url);
            setGuidelines(data.data);
          } catch (error) {
            console.error("Error fetching schemes:", error);
          }
        };
    
        fetchSchemes();
      }, []);

  return (
    <div className='guidelines'>
        <div className='guidelines-search-container'>
            <h1>Available Guidelines</h1>
            <p>Browse our collection of essential farming guidelines to help you improve productivity, manage resources, and adopt modern agricultural practices.</p>
                <div>
                    <img src={assets.search_icon} />
                    <input type="text" placeholder='Search guidelines by crop, practice or keyword' value={search} onChange={(e)=>{setSearch(e.target.value)}} />
                    <img src={assets.filter_icon}/>
                </div>
        </div>
        <div className="guidelines-list">
         {
                guidelines?.map((guideline,index)=>{
                    return <GuidelineCard imageUrl={guideline.imageUrl} shortDesc={guideline.shortDesc} title={guideline.title}  publishDate={guideline.publishDate} id={guideline._id}  key={index}/>
                })
            }
          
        </div>
    </div>
  )
}

export default Guidelines