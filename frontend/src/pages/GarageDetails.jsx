import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Constants";

export default function GarageDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [garage, setGarage] = useState({
    name: location.state?.name ?? "",
    location: location.state?.location ?? "",
    ownerName: location.state?.ownerName ?? "",
  });
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if we already have state (from navigate) skip fetch
    if (location.state?.name) return;
    if (!id) return;

    const fetchGarage = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BASE_URL}/api/garages/${encodeURIComponent(id)}`);
        const g = res.data || {};
        setGarage({
          name: g.garageName ?? g.name ?? "Unknown Garage",
          location: g.garageAddress ?? g.address ?? "Location not set",
          ownerName: g.ownerName ?? g.owner ?? g.contactName ?? "Owner Name",
        });
      } catch (err) {
        console.error("Failed to fetch garage:", err);
        setError("Failed to load garage details");
      } finally {
        setLoading(false);
      }
    };

    fetchGarage();
  }, [id, location.state]);

  const staticServices = ["Oil Change", "Car Wash", "Battery Replacement"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Garages
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">{garage.name}</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{garage.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Owner</p>
                        <p className="font-medium text-gray-900">{garage.ownerName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staticServices.map((service, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 transition-transform hover:scale-102 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{service}</h4>
                        <p className="text-sm text-gray-600 mt-1">Starting from — ₹499</p>
                      </div>
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  navigate(`/garage/${id}/book`, {
                    state: { garage },
                  })
                }
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-0.5"
              >
                Book an Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
