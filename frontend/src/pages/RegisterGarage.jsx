import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { BASE_URL } from "../../Constants";

export default function RegisterGarage() {
  const [form, setForm] = useState({ garageName: "", ownerName: "", email: "", password: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      // build wrapper object expected by backend
      const payload = {
        user: {
          name: form.ownerName,
          email: form.email,
          password: form.password,
        },
        garage: {
          garageName: form.garageName,
          garageAddress: form.address,
        },
      };
      // use axios instead of registerGarage helper
      const res = await axios.post(`${BASE_URL}/api/register/garage`, payload);
      // success when status is 200/201 or backend provides ok flag
      if (res?.status === 200 || res?.status === 201 || res?.data?.ok) {
        setMsg("Garage registration submitted. You can login after approval.");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setMsg(res?.data?.message || "Could not register garage");
      }
    } catch (err) {
      setMsg(err?.response?.data?.message || err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center relative z-10">
        
        {/* Left side - Registration form */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-slate-800">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <img 
                src="/pitstopSample.png" 
                alt="Company Logo" 
                className="w-64 h-64 object-contain"
              />
            </div>
            <div>
              <div className="text-white font-bold text-3xl">PiStop</div>
              <div className="text-cyan-400 text-lg font-semibold">Servix</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Register your Garage</h2>
          <p className="text-slate-400 text-sm mb-8">Provide basic garage details. Backend may require approval.</p>

          <form onSubmit={submit}>
            {/* Garage Name */}
            <div className="mb-5">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                  name="garageName"
                  placeholder="Garage name"
                  value={form.garageName}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Owner Name */}
            <div className="mb-5">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                  name="ownerName"
                  placeholder="Owner full name"
                  value={form.ownerName}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm tracking-widest"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-5">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                  name="address"
                  placeholder="Garage address"
                  value={form.address}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* Message */}
            {msg && (
              <div className={`mb-5 p-3 rounded-lg text-sm ${
                msg.includes('success') || msg.includes('submitted') 
                  ? 'bg-green-500/10 border border-green-500/50 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/50 text-red-400'
              }`}>
                {msg}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all text-sm font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-slate-900 font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Register Garage"}
              </button>
            </div>
          </form>
        </div>

        {/* Right side - Welcome section */}
        <div className="text-center relative hidden md:block">
          {/* Glowing circles */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-cyan-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-cyan-300 rounded-full opacity-40 blur-2xl animate-pulse delay-500"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-cyan-200 rounded-full opacity-50 blur-xl animate-pulse delay-700"></div>
            </div>
            
            {/* Logo Image - Replace src with your logo path */}
            <div className="relative z-10">
              <img 
                src="/pitstopSample.png" 
                alt="Company Logo" 
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl">Join Us.</h1>
          <p className="text-slate-400 mb-2 max-w-md mx-auto leading-relaxed px-4">
            Register your garage and become part of our growing network. Get access to our platform and connect with customers looking for quality service.
          </p>
          <div className="text-slate-500 text-sm">
            Already have an account? <a href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors underline">Login here</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}