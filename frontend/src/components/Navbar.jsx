import React, {useEffect,useState} from "react";
import { Link, useNavigate , useLocation} from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // On homepage, threshold is 550 for transparency
      if (location.pathname === "/" && window.scrollY > 550) {
        setIsScrolled(true);
      } 
      // On other pages, always solid
      else if (location.pathname !== "/") {
        setIsScrolled(true);
      } 
      else {
        setIsScrolled(false);
      }
    };

    handleScroll(); // initial check

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300
        ${isScrolled 
          ? "bg-white shadow-lg" 
          : "bg-transparent"
        }`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <Link to="/" className="flex items-center gap-3 group">
        <div
          className="w-10 h-10 rounded-xl overflow-hidden transform group-hover:scale-105 transition-all duration-300"
          style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
        </div>
        <div
          className={`font-bold text-lg transition-colors ${
            isScrolled ? "text-gray-900" : "text-white"
          } group-hover:text-indigo-400`}
        >
          PitStop Servix
        </div>
      </Link>

      <nav className="flex items-center gap-6">
        <Link
          to="/"
          className={`font-medium transition-colors ${
            isScrolled
              ? "text-gray-700 hover:text-indigo-600"
              : "text-white hover:text-indigo-300"
          }`}
        >
          Home
        </Link>

        {!token ? (
          <>
            <Link
              to="/login"
              className={`font-medium transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-indigo-600"
                  : "text-white hover:text-indigo-300"
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                isScrolled
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                  : "bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              }`}
            >
              Sign up
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-lg font-medium ${
                isScrolled
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-white/10 border border-white/20 text-white backdrop-blur-sm"
              }`}
            >
              {user?.name || user?.email}
            </div>
            <button
              onClick={logout}
              className={`font-medium flex items-center gap-2 transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-red-600"
                  : "text-white hover:text-red-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  </div>
</header>
  );
}