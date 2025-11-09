import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Constants";

export default function Signup() {
  const [form, setForm] = useState({
    user: {
      email: "",
      name: "",
      password: ""
    },
    profile: {
      vehicleNumber: "",
      phone: ""
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const onChange = (e) => {
  const { name, value } = e.target;
  // Fields for 'user'
  if (["name", "email", "password"].includes(name)) {
    setForm(prev => ({
      ...prev,
      user: { ...prev.user, [name]: value }
    }));
  } else {
    setForm(prev => ({
      ...prev,
      profile: { ...prev.profile, [name]: value }
    }));
  }
};

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/register/customer`, form);
      const data = res?.data || {};
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || { email: form.user.email }));
        navigate("/");
      } else {
        setError(data?.message || "Could not register");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-card mx-auto">
      <h2 className="card-title">Create your customer account</h2>
      <p className="card-sub">Sign up as a user. To register a garage, use the button beside submit.</p>

      <form onSubmit={submit}>
        <div className="form-row">
          <input 
            className="input" 
            name="name" 
            placeholder="Full name" 
            value={form.user.name} 
            onChange={onChange} 
            required 
          />
        </div>
        <div className="form-row">
          <input 
            className="input" 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={form.user.email} 
            onChange={onChange} 
            required 
          />
        </div>
        <div className="form-row">
          <input 
            className="input" 
            name="password" 
            type="password" 
            placeholder="Password" 
            value={form.user.password} 
            onChange={onChange} 
            required 
          />
        </div>
        <div className="form-row">
          <input 
            className="input" 
            name="vehicleNumber" 
            placeholder="Vehicle Number (e.g., UK07-1234)" 
            value={form.profile.vehicleNumber} 
            onChange={onChange} 
            required 
          />
        </div>
        <div className="form-row">
          <input 
            className="input" 
            name="phone" 
            placeholder="Phone (optional)" 
            value={form.profile.phone} 
            onChange={onChange} 
          />
        </div>


        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

        <div className="flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={() => navigate("/register-garage")} 
            className="btn btn-ghost"
          >
            Register as Garage
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}