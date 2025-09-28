import React from "react";
import "./Profile.css";
import profilePic from "../../assets/test.png";
import { useUserContext } from "../../Context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
//   const user = {
//     name: "Anurag Patel",
//     email: "anuragpateloriginal@gmail.com",
//     mobileNo: "+91 7805800320",
//     language: "English",
//     soilType: "Alluvial",
//     location: {
//       village: "Govindgarh",
//       district: "Rewa",
//       state: "Madhya Pradesh",
//       pincode: "486001",
//     },
//   };

  const {user,setUser}=useUserContext();
  const navigate=useNavigate();

  const handleEdit = () => alert("working on it ...");

  const logoutHandle=async()=>{
    try {
      const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`;
      const {data}=await axios.post(endpoint,{},{withCredentials:true});
      if(data.success){
          setUser(null);
          navigate('/auth');
      }
    } catch (error) {
      console.log("error in logout",error.message);
    }
  }

  return (
    <div className="profile-page">
      {/* Top header with photo and name */}
      <div className="profile-header">
        <div className="profile-photo-wrap">
          <img src={profilePic} alt="Profile" className="profile-photo" />
        </div>
        <div className="profile-header-info">
          <h2>{user?.name  || "N/A"}</h2>
          <p>{user?.email  || "N/A"}</p>
          <p>{user?.mobileNo  || "N/A"}</p>
        </div>
        <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
      </div>

      {/* Details */}
      <div className="profile-sections">
        <section className="profile-card">
          <h3>Basic Details</h3>
          <div className="card-grid">
            <p><strong>Language:</strong> {user?.language  || "N/A"}</p>
            <p><strong>Soil Type:</strong> {user?.soilType  || "N/A"}</p>
          </div>
        </section>

        <section className="profile-card">
          <h3>Location</h3>
          <div className="card-grid">
            <p><strong>Village:</strong> {user?.location?.village  || "N/A"}</p>
            <p><strong>District:</strong> {user?.location?.district  || "N/A"}</p>
            <p><strong>State:</strong> {user?.location?.state  || "N/A"}</p>
            <p><strong>Pincode:</strong> {user?.location?.pincode  || "N/A"}</p>
          </div>
        </section>

        <div className="logout-div">
        <button className="edit-btn" onClick={logoutHandle}>Logout</button>
        </div>
      </div>

      
    </div>
  );
};

export default Profile;
