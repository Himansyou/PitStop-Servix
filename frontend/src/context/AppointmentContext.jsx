import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Constants";

export const AppointmentStatus = Object.freeze({
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
});

const AppointmentContext = createContext(null);

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/appointments`);
      setAppointments(response.data || []);
    } catch (err) {
      console.error("Failed to load appointments", err);
      setError(err?.response?.data?.message || "Unable to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const createAppointment = async (payload) => {
    const response = await axios.post(`${BASE_URL}/api/appointments`, payload);
    const created = response.data;
    setAppointments((prev) => [created, ...prev]);
    return created;
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    if (!Object.values(AppointmentStatus).includes(status)) {
      throw new Error("Unsupported status");
    }
    const response = await axios.patch(`${BASE_URL}/api/appointments/${appointmentId}/status`, { status });
    const { appointment, notificationSent } = response.data || {};
    if (appointment) {
      setAppointments((prev) => prev.map((appt) => (appt.id === appointmentId ? appointment : appt)));
    }
    return { appointment, notificationSent };
  };

  const metrics = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter((appt) => appt.status === AppointmentStatus.CONFIRMED || appt.status === AppointmentStatus.PENDING).length;
    const completed = appointments.filter((appt) => appt.status === AppointmentStatus.COMPLETED).length;
    return { total, upcoming, completed };
  }, [appointments]);

  const value = useMemo(
    () => ({
      appointments,
      loading,
      error,
      metrics,
      refresh: fetchAppointments,
      createAppointment,
      updateAppointmentStatus,
    }),
    [appointments, loading, error, metrics, fetchAppointments]
  );

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}

export const useAppointments = () => {
  const ctx = useContext(AppointmentContext);
  if (!ctx) {
    throw new Error("useAppointments must be used inside AppointmentProvider");
  }
  return ctx;
};


