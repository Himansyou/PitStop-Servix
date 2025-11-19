import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Clock, Filter, RefreshCw, Search } from "lucide-react";
import { useAppointments, AppointmentStatus } from "../context/AppointmentContext";
import { formatAppointmentDateTime } from "../utils/appointmentTime";

const STATUS_LABELS = {
  [AppointmentStatus.PENDING]: { label: "Pending", color: "bg-amber-100 text-amber-900 border-amber-200" },
  [AppointmentStatus.CONFIRMED]: { label: "Confirmed", color: "bg-blue-100 text-blue-900 border-blue-200" },
  [AppointmentStatus.COMPLETED]: { label: "Completed", color: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  [AppointmentStatus.CANCELLED]: { label: "Cancelled", color: "bg-rose-100 text-rose-900 border-rose-200" },
};

export default function AdminAppointments() {
  const { appointments, metrics, updateAppointmentStatus, loading, error, refresh } = useAppointments();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const haystack = `${appt.garage?.name ?? ""} ${appt.customer?.name ?? ""} ${appt.customer?.email ?? ""}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || appt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const groupedByGarage = useMemo(() => {
    const map = new Map();
    filteredAppointments.forEach((appt) => {
      const key = appt.garage?.id ?? appt.garage?.name ?? `garage-${appt.id}`;
      if (!map.has(key)) {
        map.set(key, { garage: appt.garage, appointments: [] });
      }
      map.get(key).appointments.push(appt);
    });
    return Array.from(map.values());
  }, [filteredAppointments]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const triggerToast = (message, tone = "success") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, tone });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 4000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (appointment, nextStatus) => {
    if (appointment.status === nextStatus) return;
    try {
      const { notificationSent } = await updateAppointmentStatus(appointment.id, nextStatus);
      if (notificationSent) {
        triggerToast(`Confirmation email sent to ${appointment.customer?.email ?? appointment.customer?.name ?? "customer"}.`);
      } else {
        triggerToast("Appointment updated.", "info");
      }
    } catch (err) {
      console.error("Status update failed", err);
      triggerToast(err?.response?.data?.message || "Failed to update appointment.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 rounded-xl px-4 py-3 shadow-lg text-sm font-medium ${
            toast.tone === "error"
              ? "bg-rose-600 text-white"
              : toast.tone === "info"
              ? "bg-blue-600 text-white"
              : "bg-emerald-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            
            <h1 className="text-3xl font-bold text-slate-900 mt-1">Appointments Dashboard</h1>
            <p className="text-slate-500 mt-1 max-w-2xl">
              Monitor demand, adjust staffing, and keep every customer in the loop with quick status updates.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Syncing..." : "Sync Data"}
          </button>
        </header>

        <section className="grid md:grid-cols-3 gap-4">
          <MetricCard label="Total Bookings" value={metrics.total} sub="All time" icon={<Clock className="w-5 h-5 text-blue-500" />} />
          <MetricCard label="Upcoming" value={metrics.upcoming} sub="Pending & confirmed" icon={<Filter className="w-5 h-5 text-amber-500" />} />
          <MetricCard label="Completed" value={metrics.completed} sub="Marked done" icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} />
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by garage or customer"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["ALL", ...Object.values(AppointmentStatus)].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                    statusFilter === status ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {status === "ALL" ? "All" : STATUS_LABELS[status]?.label || status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                Loading appointments...
              </div>
            ) : error ? (
              <div className="p-12 text-center text-rose-500">{error}</div>
            ) : groupedByGarage.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No appointments match the current filters.</div>
            ) : (
              groupedByGarage.map(({ garage, appointments: garageAppointments }) => (
                <article key={garage?.id ?? garage?.name} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 bg-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{garage?.name ?? "Unnamed Garage"}</p>
                      <p className="text-xs text-slate-500">{garage?.address}</p>
                    </div>
                    <div className="text-xs text-slate-500">Owner: {garage?.ownerName ?? "N/A"}</div>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {garageAppointments.map((appt) => (
                      <div key={appt.id} className="p-5 grid gap-4 md:grid-cols-[1.2fr,1fr,0.8fr] items-center">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">Customer</p>
                          <p className="text-sm font-semibold text-slate-900">{appt.customer?.name}</p>
                          <p className="text-xs text-slate-500">{appt.customer?.email}</p>
                          <p className="text-xs text-slate-400 mt-1">{appt.serviceType}</p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">Schedule</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {formatAppointmentDateTime(appt.appointmentDate, appt.timeSlot)}
                          </p>
                          <p className="text-xs text-slate-500">Slot: {appt.timeSlot}</p>
                          {appt.notification?.lastSentAt && (
                            <p className="text-xs text-emerald-600 mt-1">
                              Email sent: {new Date(appt.notification.lastSentAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_LABELS[appt.status]?.color}`}>
                            {STATUS_LABELS[appt.status]?.label || appt.status}
                          </span>
                          <select
                            value={appt.status}
                            onChange={(e) => handleStatusChange(appt, e.target.value)}
                            className="w-full border border-slate-300 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            {Object.values(AppointmentStatus).map((status) => (
                              <option key={status} value={status}>
                                {STATUS_LABELS[status]?.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{sub}</p>
        <p className="text-3xl font-bold text-slate-900">{value.toString().padStart(2, "0")}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
      <div className="p-3 rounded-xl bg-slate-100">{icon}</div>
    </div>
  );
}


