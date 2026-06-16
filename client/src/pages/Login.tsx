import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Lock, Mail } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = trpc.auth.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success("Connexion réussie");
      setLocation("/admin-dashboard");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur de connexion";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-cyan-100 p-3 rounded-full">
              <Lock className="h-6 w-6 text-cyan-700" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Garnier Nettoyage
          </h1>
          <p className="text-center text-slate-600 mb-8">
            Espace administrateur
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="admin@garnier-nettoyage.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-cyan-700 hover:bg-cyan-800 text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Identifiants administrateur requis
          </p>
        </div>
      </div>
    </div>
  );
}
