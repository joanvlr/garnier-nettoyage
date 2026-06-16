import { useEffect } from "react";
import { useLocation } from "wouter";
import AdminDashboard from "./AdminDashboard";
import { trpc } from "@/lib/trpc";

export default function AdminDashboardProtected() {
  const [, setLocation] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();

  useEffect(() => {
    const isAuthorized = sessionStorage.getItem("admin_auth") === "true";
    const isOAuthUser = user !== undefined && user !== null;

    if (!isAuthorized && !isOAuthUser) {
      setLocation("/admin-rzc4f9imsu9a9jxfos10m");
    } else if (isOAuthUser) {
      // Si connecté via OAuth, marquer comme autorisé
      sessionStorage.setItem("admin_auth", "true");
    }
  }, [user, setLocation]);

  const isAuthorized = sessionStorage.getItem("admin_auth") === "true";
  const isOAuthUser = user !== undefined && user !== null;

  if (!isAuthorized && !isOAuthUser) {
    return null; // Will redirect
  }

  return <AdminDashboard />;
}
