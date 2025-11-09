import React, { useState , useEffect} from "react";
import { Search, Wrench, Droplet, Car, Zap, Shield, MapPin, Star, Phone } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../Constants";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [popularGarages, setPopularGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const services = [
    { icon: Wrench, label: "Dent Repair", color: "bg-blue-500" },
    { icon: Droplet, label: "Oil Change", color: "bg-amber-500" },
    { icon: Car, label: "Car Wash", color: "bg-cyan-500" },
    { icon: Zap, label: "Battery", color: "bg-yellow-500" },
    { icon: Shield, label: "Insurance", color: "bg-green-500" },
  ];

  // Add helper to normalize backend data
  const formatGarages = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((g, idx) => ({
      id: g.id ?? g._id ?? idx,
      name: g.garageName ?? g.name ?? "Unknown Garage",
      location: g.garageAddress ?? g.address ?? "Location not set",
      ownerName: g.ownerName ?? g.owner ?? g.contactName ?? "Owner Name",
      rating: g.rating ?? 4.9,
      reviews: g.reviews ?? 0,
      services: g.services ?? ["Oil Change", "Car Wash"],
      distance: g.distance ?? "> 1 km",
      image:
        g.image ||
        g.photo ||
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      phone: g.phone ?? g.contact ?? "+91 98765 43210",
    }));
  };

  // Move fetchGarages out so it can be reused by search handler
  const fetchGarages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/garages`);
      const garages = formatGarages(response.data);
      setPopularGarages(garages);
    } catch (err) {
      console.error("Error fetching garages:", err);
      setError("Failed to fetch garages");
      setPopularGarages([]);
    } finally {
      setLoading(false);
    }
  };

  // navigate to details page, passing dynamic fields via state
  const navigateToServices = (garage) => {
    navigate(`/garage/${garage.id}`, {
      state: {
        name: garage.name,
        location: garage.location,
        ownerName: garage.ownerName,
      },
    });
  };

  useEffect(() => {
    // use the external fetchGarages
    fetchGarages();
  }, []);

  // 🔹 Fetch filtered garages by search term
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // if empty, show all again
      return fetchGarages();
    }

    try {
      setLoading(true);
      setError(null);
      const encoded = encodeURIComponent(searchQuery.trim());
      // Use the backend search endpoint; encode the query to be safe
      const response = await axios.get(`${BASE_URL}/api/garages/search/${encoded}`);
      const garages = formatGarages(response.data);
      setPopularGarages(garages);
    } catch (err) {
      console.error("Search error:", err);
      setError("No garages found or search failed");
      setPopularGarages([]);
    } finally {
      setLoading(false);
    }
  };

  /*  const popularGarages = [
    {
      id: 1,
      name: "AutoCare Pro",
      rating: 4.8,
      reviews: 234,
      services: ["Dent Repair", "Oil Change", "Battery"],
      location: "Connaught Place, Delhi",
      distance: "2.3 km",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      phone: "+91 98765 43210"
    },
    {
      id: 2,
      name: "SpeedFix Motors",
      rating: 4.6,
      reviews: 189,
      services: ["Car Wash", "Oil Change", "Insurance"],
      location: "Karol Bagh, Delhi",
      distance: "3.1 km",
      image: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=300&fit=crop",
      phone: "+91 98765 43211"
    },
    {
      id: 3,
      name: "Elite Service Center",
      rating: 4.9,
      reviews: 312,
      services: ["Dent Repair", "Battery", "Car Wash"],
      location: "Lajpat Nagar, Delhi",
      distance: "4.5 km",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
      phone: "+91 98765 43212"
    },
    {
      id: 4,
      name: "Quick Service Hub",
      rating: 4.7,
      reviews: 267,
      services: ["Oil Change", "Battery", "Insurance"],
      location: "Nehru Place, Delhi",
      distance: "5.2 km",
      image: "https://images.unsplash.com/photo-1632823470595-d2faa0bcefef?w=400&h=300&fit=crop",
      phone: "+91 98765 43213"
    },
    {
      id: 5,
      name: "Premium Auto Care",
      rating: 4.8,
      reviews: 198,
      services: ["Dent Repair", "Car Wash", "Oil Change"],
      location: "Saket, Delhi",
      distance: "6.0 km",
      image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop",
      phone: "+91 98765 43214"
    }
  ];
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 -mt-17">
      {/* Hero Section */}
<div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
  {/* 🔹 Video Background */}
  <video
    className="absolute inset-0 w-full h-full object-cover filter blur-xs scale-105"
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
  >
    <source src="/garage-bg.mp4" type="video/mp4" />
    {/* fallback image if video not supported */}
    <img
      src="https://images.unsplash.com/photo-1585421514284-efb74c2b59dd?w=1200&h=600&fit=crop"
      alt="Garage background"
      className="w-full h-full object-cover"
    />
  </video>

  {/* 🔹 Overlay for better text readability */}
  <div className="absolute inset-0 bg-black opacity-40"></div>

  {/* 🔹 Hero content */}
  <div className="relative container mx-auto px-4 py-40 md:py-60">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-5xl md:text-5xl font-bold mb-6">
        Welcome to Pitstop Servix
      </h1>
      <p className="text-xl md:text-2xl mb-10 text-blue-100">
        Your OneStop Platform for Premium Vehicle Care
      </p>
    </div>
  </div>
</div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search Section */}
        <div className="mb-12 -mt-2">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              {/* Turn into a form so Enter works and button submits */}
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search for garages, services, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Our Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <button
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-slate-100 group"
                >
                  <div className={`${service.color} w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-slate-700 text-center">
                    {service.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Garages Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Popular Garages</h2>
            <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              View All →
            </button>
          </div>

          {/* Loading / Error */}
          {loading ? (
            <div className="py-12 text-center text-slate-600">Loading garages...</div>
          ) : error ? (
            <div className="py-6 text-center text-red-600">{error}</div>
          ) : null}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGarages.map((garage) => (
              <div
                key={garage.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-slate-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={garage.image}
                    alt={garage.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{garage.rating || 4.9}</span>
                    <span className="text-slate-500 text-xs">({garage.reviews})</span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{garage.name}</h3>
                  
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-slate-600">{garage.location}</div>
                      <div className="text-xs text-blue-600 font-medium">{garage.distance} away</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {garage.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateToServices(garage)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Check Services
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>  
      </div>
    </div>
  );
}