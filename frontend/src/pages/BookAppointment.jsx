import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, User, CheckCircle2, Loader2 } from "lucide-react";
import { useAppointments } from "../context/AppointmentContext";
import axios from "axios";
import { BASE_URL } from "../../Constants";
import { formatAppointmentDateTime } from "../utils/appointmentTime";

const slotTemplates = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

const generateUpcomingDays = (totalDays = 7) =>
  Array.from({ length: totalDays }, (_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() + idx + 1);
    return {
      iso: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }),
    };
  });

export default function BookAppointment() {
    
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { createAppointment } = useAppointments();
  console.log("Garage from state:", location.state?.garage);


  const [garage, setGarage] = useState(location.state?.garage || null);
  const [loading, setLoading] = useState(!location.state?.garage);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    service: "Comprehensive Check-up",
    date: generateUpcomingDays()[0]?.iso ?? "",
    slot: slotTemplates[0],
    notes: "",
  });

  useEffect(() => {
   
    if (!id) return;
    const controller = new AbortController();
    const loadGarage = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`${BASE_URL}/api/garages/${id}`, { signal: controller.signal });
        
        const payload = response.data || {};
        setGarage({
          id: payload.id ?? id,
          name: payload.garageName ?? payload.name ?? "Unnamed Garage",
          location: payload.garageAddress ?? payload.address ?? "Location not set",
          ownerName: payload.ownerName ?? payload.owner ?? "Owner",
          email: payload.owner?.email ?? null,
        });
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Unable to fetch garage", err);
        setError("Unable to fetch garage details. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadGarage();
    return () => controller.abort();
  }, [id, location.state?.garage]);

  const availableDays = useMemo(() => generateUpcomingDays(10), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!garage) return;
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user?.id) {
      navigate("/login");
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    try {
      const appointment = await createAppointment({
        garageId: garage.id,
        customerId: user.id,
        serviceType: form.service,
        timeSlot: form.slot,
        appointmentDate: form.date,
        notes: form.notes,
        contactPhone: user.customerProfile?.phone || user.phone,
      });
      setConfirmation(appointment);
      setForm((prev) => ({ ...prev, notes: "" }));
    } catch (err) {
      console.error("Appointment booking failed", err);
      setSubmitError(err?.response?.data?.message || "Failed to create appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !garage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4 text-center">
        <p className="text-red-600 font-semibold mb-4">{error || "Garage not found."}</p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-24 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-500 font-semibold">Booking Garage</p>
              <h1 className="text-3xl font-bold text-slate-900">{garage.name}</h1>
              <div className="flex items-center gap-2 text-slate-500 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{garage.location}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 text-sm text-blue-600 rounded-full bg-blue-50 hover:bg-blue-100"
            >
              Back
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-slate-500">Garage Email</p>
                <p className="font-semibold text-slate-800">{garage.email || "Owner Huh"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-slate-50">
              <Clock className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-slate-500">Average Turnaround</p>
                <p className="font-semibold text-slate-800">2 - 4 hours</p>
              </div>
            </div>

            {confirmation && (
              <div className="p-5 bg-green-50 border border-green-100 rounded-2xl flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-green-800 text-left">
                  Appointment #{String(confirmation.id).padStart(4, "0")} created successfully.
                  <div className="text-green-600 font-semibold">
                    {formatAppointmentDateTime(confirmation.appointmentDate, confirmation.timeSlot)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-600 mb-2 block">Select Preferred Date</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableDays.map((day) => (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, date: day.iso }))}
                  className={`p-3 rounded-2xl border text-left transition ${
                    form.date === day.iso ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold" : "border-slate-200 hover:border-blue-200"
                  }`}
                >
                  <div className="text-xs uppercase tracking-wide text-slate-500">Day</div>
                  <div>{day.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 mb-2 block">Choose Time Slot</label>
            <div className="grid grid-cols-2 gap-3">
              {slotTemplates.map((slot) => (
                <label
                  key={slot}
                  className={`flex items-center gap-3 border rounded-2xl px-4 py-3 cursor-pointer transition ${
                    form.slot === slot ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-200"
                  }`}
                >
                  <input type="radio" name="slot" value={slot} checked={form.slot === slot} onChange={handleChange} className="sr-only" />
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-slate-800">{slot}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 mb-2 block">Service Type</label>
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
            >
              <option>Comprehensive Check-up</option>
              <option>Oil & Filter Replacement</option>
              <option>Dent & Paint Restoration</option>
              <option>Battery & Electrical Diagnosis</option>
              <option>Car Wash & Detailing</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-600 mb-2 block flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Describe issues, preferred technician, or custom instructions..."
              className="w-full border border-slate-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 min-h-[120px]"
            />
          </div>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">{submitError}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}


