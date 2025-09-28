import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import { useUserContext } from "../../Context/UserContext";

export default function AuthTabs() {
  const [tab, setTab] = useState("login");
  const [formData, setFormData] = useState({
    mobile: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {setUser}=useUserContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() && !formData.mobile.trim()) {
      setError("Please provide either Email or Mobile number.");
      return;
    }

    setError("");
    setLoading(true);

    const url =
      tab === "login" ? `${import.meta.env.VITE_BACKEND_URL}/api/user/login` : `${import.meta.env.VITE_BACKEND_URL}/api/user/register`;

    try {

      const { data } = await axios.post( url, formData ,{withCredentials:true});
      
      if(data.success){
        setUser(data.user)
        navigate("/profile");
      }else{
        alert(data);
      }
      
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tabs-auth-container">
      <div className="tabs-auth-card">
        {/* Tabs */}
        <div className="tabs-header">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={tab === "signup" ? "active" : ""}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="tabs-form">
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number (optional if email is provided)"
            value={formData.mobile}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address (optional if mobile is provided)"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="tabs-error">{error}</p>}

          <button
            type="submit"
            className="tabs-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : tab === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
