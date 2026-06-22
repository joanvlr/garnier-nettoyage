import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileText, Mail, MapPin, Phone, Archive, MessageSquare, Search, X, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();
  const { data: requests, isLoading, refetch } = trpc.quotes.getAll.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const updateStatusMutation = trpc.quotes.updateStatus.useMutation();
  const deleteMutation = trpc.quotes.delete.useMutation();
  const sendMessageMutation = trpc.messages.send.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>({});
  const [messageContent, setMessageContent] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

  const filteredRequests = useMemo(() => {
    if (!requests) return [];

    return requests.filter((request: any) => {
      const matchesSearch =
        searchTerm === "" ||
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.phone.includes(searchTerm) ||
        (request.email && request.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.building && request.building.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Accès refusé</h1>
          <p className="mt-2 text-slate-600">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (requestId: number, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: requestId,
        status: newStatus as "new" | "contacted" | "completed" | "rejected",
      });
      setSelectedStatus((prev) => ({ ...prev, [requestId]: newStatus }));
      toast.success("Statut mis à jour");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDelete = async (requestId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      try {
        await deleteMutation.mutateAsync({ id: requestId });
        toast.success("Demande supprimée");
        refetch();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleSendMessage = async (requestId: number) => {
    if (!messageContent.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        quoteId: requestId,
        content: messageContent,
      });
      setMessageContent("");
      setSelectedRequestId(null);
      toast.success("Message envoyé");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Nouvelle";
      case "contacted":
        return "Contactée";
      case "completed":
        return "Complétée";
      case "rejected":
        return "Rejetée";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Demandes de devis</h1>
            <p className="mt-2 text-slate-600">Gérez les demandes de nettoyage reçues</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 space-y-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, email, téléphone ou bâtiment..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="new">Nouvelle</SelectItem>
                <SelectItem value="contacted">Contactée</SelectItem>
                <SelectItem value="completed">Complétée</SelectItem>
                <SelectItem value="rejected">Rejetée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-slate-600">
            {filteredRequests.length} demande{filteredRequests.length !== 1 ? "s" : ""} trouvée
            {filteredRequests.length !== 1 ? "s" : ""}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p className="text-slate-600">Chargement des demandes...</p>
          </div>
        ) : !filteredRequests || filteredRequests.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">
              {requests?.length === 0 ? "Aucune demande de devis pour le moment" : "Aucune demande ne correspond à votre recherche"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 bg-slate-50">
                  <TableHead className="px-6 py-3 text-left font-semibold text-slate-900">Nom</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-slate-900">Contact</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-slate-900">Bâtiment</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-slate-900">Description</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-slate-900">Statut</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-slate-900">Fichiers</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-slate-900">Actions</TableHead>
                  <TableHead className="px-6 py-3 text-left font-semibold text-slate-900">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request: any) => (
                  <TableRow key={request.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <TableCell className="px-6 py-4 font-medium text-slate-900">{request.name}</TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <a href={`tel:${request.phone}`} className="flex items-center gap-2 text-cyan-700 hover:underline">
                          <Phone className="h-4 w-4" />
                          {request.phone}
                        </a>
                        {request.email && (
                          <a href={`mailto:${request.email}`} className="flex items-center gap-2 text-cyan-700 hover:underline">
                            <Mail className="h-4 w-4" />
                            {request.email}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {request.building ? (
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          {request.building}
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="max-w-xs text-sm text-slate-700">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-left hover:text-cyan-700 transition-colors">
                              <p className="line-clamp-3 cursor-pointer">{request.message}</p>
                              {request.message && request.message.length > 60 && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Voir tout</span>
                              )}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-cyan-600" />
                                Description de la demande - {request.name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-lg bg-slate-50 p-6 border border-slate-100">
                              <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-800">
                                {request.message || "Aucune description fournie."}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Select
                        value={selectedStatus[request.id] || request.status}
                        onValueChange={(value: string) => handleStatusChange(request.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Nouvelle</SelectItem>
                          <SelectItem value="contacted">Contactée</SelectItem>
                          <SelectItem value="completed">Complétée</SelectItem>
                          <SelectItem value="rejected">Rejetée</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {request.files && request.files.length > 0 ? (
                        <div className="space-y-1">
                          {request.files.map((file: any, index: number) => (
                            <a
                              key={index}
                              href={file.url}
                              download={file.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-cyan-700 hover:underline"
                              title={`Télécharger ${file.name}`}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="truncate text-sm">{file.name}</span>
                              <Download className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500">Aucun</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              title="Envoyer un message"
                              onClick={() => setSelectedRequestId(request.id)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Envoyer un message à {request.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <textarea
                                placeholder="Entrez votre message..."
                                value={messageContent}
                                onChange={(e: any) => setMessageContent(e.target.value)}
                                className="w-full rounded border border-slate-200 p-3 text-sm"
                                rows={4}
                              />
                              <Button
                                onClick={() => handleSendMessage(request.id)}
                                disabled={sendMessageMutation.isPending}
                              >
                                {sendMessageMutation.isPending ? "Envoi..." : "Envoyer"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="destructive"
                          title="Supprimer"
                          onClick={() => handleDelete(request.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-slate-600">
                      {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
