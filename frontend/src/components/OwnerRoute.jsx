import React from "react";
import { Navigate } from "react-router-dom";

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || "owner@pitstopservix.com";
const OWNER_ROLES = ["OWNER", "ADMIN", "GARAGE_OWNER"];

const normalizeRole = (role) => (typeof role === "string" ? role.toUpperCase() : role?.toUpperCase?.());

const isOwnerUser = (user) => {
  if (!user) return false;
  const role = normalizeRole(user?.role);
  if (role && OWNER_ROLES.includes(role)) return true;
  if (Array.isArray(user?.roles) && user.roles.some((r) => OWNER_ROLES.includes(normalizeRole(r)))) return true;
  if (user?.isOwner) return true;
  if (user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()) return true;
  return false;
};

export default function OwnerRoute({ children }) {
  const storedUser = typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!isOwnerUser(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
}


