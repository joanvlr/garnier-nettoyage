import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, LogIn } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

const ADMIN_PASSWORD = "GarnierAdmin2024Secure";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = trpc.auth.me.useQuery();

  // Si l'utilisateur est déjà connecté via OAuth, le rediriger au dashboard
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("admin_auth", "true");
      setLocation("/admin-rzc4f9imsu9a9jxfos10m/dashboard");
    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a small delay for security
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store auth token in sessionStorage (not localStorage for security)
        sessionStorage.setItem("admin_auth", "true");
        toast.success("Accès admin autorisé");
        setLocation("/admin-rzc4f9imsu9a9jxfos10m/dashboard");
      } else {
        toast.error("Code d'accès incorrect");
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleOAuthLogin = () => {
    // Store the redirect path in sessionStorage so we can redirect after OAuth callback
    sessionStorage.setItem("admin_redirect", "/admin-rzc4f9imsu9a9jxfos10m/dashboard");
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-cyan-700 p-4 rounded-full">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Accès Admin
          </h1>
          <p className="text-center text-slate-600 text-sm mb-6">
            Garnier Nettoyage
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleOAuthLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Se connecter avec Manus OAuth
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">ou</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code d'accès
                </label>
                <Input
                  type="password"
                  placeholder="Entrez le code d'accès"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-cyan-700 hover:bg-cyan-800"
              >
                {isLoading ? "Vérification..." : "Accéder"}
              </Button>
            </form>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Cette page est protégée. Accès autorisé uniquement aux administrateurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
