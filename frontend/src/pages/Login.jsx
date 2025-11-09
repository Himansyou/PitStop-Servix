import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Constants";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/login`, form);
      const data = res?.data || {};
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || { email: form.email }));
        navigate("/");
      } else {
        setErr(data?.message || "Login failed");
      }
    } catch (err) {
      setErr(err?.response?.data?.message || err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center relative z-10">
        
        {/* Left side - Login form */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-slate-800">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <img 
                src="/pitstopSample.png" 
                alt="Company Logo" 
                className="w-64 h-64 object-contain"
              />
            </div>
            <div>
              <div className="text-white font-bold text-2xl">PitStop</div>
              <div className="text-cyan-400 text-lg font-semibold">Servix</div>
            </div>
          </div>

          <form onSubmit={submit}>
            {/* Email input */}
            <div className="mb-6">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                  name="email"
                  type="email"
                  placeholder="USERNAME"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="mb-6">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm tracking-widest"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Error message */}
            {err && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {err}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-slate-900 font-bold py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-6 text-sm"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                Forgot your password?
              </a>
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
            
            {/* Logo Image */}
            <div className="relative z-10">
              <img 
                src="/pitstopSample.png" 
                alt="Company Logo" 
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-1 -mt-7 drop-shadow-2xl">Welcome.</h1>
          <p className="text-slate-400 mb-2 max-w-md mx-auto  leading-relaxed px-4">
            Ready Get Set Go! Experience seamless vehicle servicing with PitStop Servix. Log in to manage your appointments, track service history, and access exclusive offers tailored just for you.
          </p>
          <div className="text-slate-500 text-sm">
            Not a member? <a href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors underline">Sign up now</a>
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