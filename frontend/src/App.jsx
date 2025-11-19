import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import RegisterGarage from "./pages/RegisterGarage";
import GarageDetails from "./pages/GarageDetails";
import BookAppointment from "./pages/BookAppointment";
import AdminAppointments from "./pages/AdminAppointments";
import OwnerRoute from "./components/OwnerRoute";
import { AppointmentProvider } from "./context/AppointmentContext";
import "./App.css";

export default function App() {
  return (
    <AppointmentProvider>
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/register-garage" element={<RegisterGarage />} />
            <Route path="/login" element={<Login />} />
              <Route path="/garage/:id" element={<GarageDetails />} />
              <Route path="/garage/:id/book" element={<BookAppointment />} />
              <Route
                path="/admin/appointments"
                element={
                  <OwnerRoute>
                    <AdminAppointments />
                  </OwnerRoute>
                }
              />
          </Routes>
        </main>
      </div>
    </Router>
    </AppointmentProvider>
  );
}
