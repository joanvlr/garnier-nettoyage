import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Star,
  WandSparkles,
  ChevronDown,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

/*
  Garnier Nettoyage — Modernisme méditerranéen hygiéniste.
  Cette page suit des diagonales propres, une lumière calcaire, un bleu lagon,
  des preuves de confiance proches des CTA, des reflets translucides et un
  mouvement net et rassurant. Chaque choix doit renforcer cette philosophie.
*/

const heroImage = "/assets/hero.webp";
const servicesImage = "/assets/services.webp";
const contactImage = "/assets/contact.webp";

const services = [
  {
    icon: Building2,
    title: "Entretien copropriété",
    shortText: "Halls, escaliers, ascenseurs, vitrages et parties communes entretenus avec régularité.",
    fullText: "Garnier Nettoyage assure le nettoyage complet des parties communes de votre copropriété. Halls d'entrée accueillants, escaliers impeccables, ascenseurs brillants, vitrages nets et locaux poubelles hygiéniques. Un entretien régulier et méthodique qui renforce l'image de votre immeuble.",
  },
  {
    icon: Sparkles,
    title: "Nettoyage de vitre",
    shortText: "Vitres intérieures et extérieures nettoyées en profondeur pour une transparence maximale.",
    fullText: "Des vitres propres et transparentes améliorent immédiatement l'apparence d'un bâtiment. Nos équipes nettoient les vitrages intérieurs et extérieurs, les cadres et les appuis de fenêtre avec soin et précision, garantissant une transparence cristalline.",
  },
  {
    icon: SprayCan,
    title: "Entretien bureau et cabinet médical",
    shortText: "Espaces de travail nets, accueillants et conformes aux normes d'hygiène professionnelle.",
    fullText: "Pour les bureaux et cabinets médicaux, l'hygiène est primordiale. Garnier Nettoyage propose un entretien régulier adapté aux normes professionnelles, avec une attention particulière aux zones sensibles et au respect des protocoles de propreté.",
  },
];

const trustPoints = [
  "Intervention à Montpellier et alentours",
  "Devis clair et réponse rapide",
  "Nettoyage de bâtiments, halls et bureaux",
  "Service soigné pour professionnels et copropriétés",
];

const processSteps = [
  ["01", "Devis et diagnostic", "Vous décrivez votre besoin. Garnier Nettoyage propose un devis clair et une visite pour diagnostiquer les surfaces et les contraintes."],
  ["02", "Visite et contrat", "Une rencontre sur place pour discuter en détail, valider le plan d'entretien et signer un contrat adapté à votre copropriété ou entreprise."],
  ["03", "Entretien régulier", "Garnier Nettoyage intervient selon le calendrier convenu, avec méthode, discrétion et régularité."],
  ["04", "Suivi et ajustements", "Un interlocuteur clair reste disponible pour ajuster le service selon vos besoins ou vos retours."],
];

const testimonials = [
  {
    name: "Sophie Martin",
    role: "Syndic de copropriété",
    text: "Garnier Nettoyage nous accompagne depuis 3 ans. L'équipe est fiable, réactive et les résidents sont satisfaits. Un vrai partenaire de confiance.",
    rating: 5,
  },
  {
    name: "Dr. Laurent Dupont",
    role: "Cabinet médical",
    text: "L'hygiène est cruciale pour notre cabinet. Garnier Nettoyage respecte scrupuleusement nos protocoles et nos patients remarquent la propreté.",
    rating: 5,
  },
  {
    name: "Thomas Leclerc",
    role: "Directeur d'agence immobilière",
    text: "Avant les visites, Garnier Nettoyage rend nos bureaux impeccables. Cela fait une vraie différence pour les clients potentiels.",
    rating: 5,
  },
];

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    building: "",
    message: "",
  });

  const [expandedService, setExpandedService] = useState<string | null>(null);

  const createQuoteMutation = trpc.quotes.create.useMutation();
  const isSubmitting = createQuoteMutation.isPending;

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Merci de renseigner au minimum votre nom, téléphone et besoin de nettoyage.");
      return;
    }

    try {
      // Submit to backend
      await createQuoteMutation.mutateAsync({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        building: form.building || undefined,
        message: form.message,
      });

      toast.success("Votre demande de devis a été envoyée avec succès !");
      setForm({ name: "", phone: "", email: "", building: "", message: "" });
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la demande. Veuillez réessayer.");
      console.error("Submit error:", error);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fbfa] text-slate-950">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/40 bg-white/82 backdrop-blur-xl">
        <nav className="container flex h-20 items-center justify-between gap-6">
          <a href="#accueil" className="group flex items-center gap-3" aria-label="Accueil Garnier Nettoyage">
            <span className="grid h-12 w-12 place-items-center bg-[#062d3b] text-lg font-black text-white shadow-lg shadow-cyan-900/20 [clip-path:polygon(14%_0,100%_0,86%_100%,0_100%)]">
              GN
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-black tracking-tight text-[#062d3b]">Garnier</span>
              <span className="block text-xs font-bold uppercase tracking-[0.28em] text-cyan-700">Nettoyage</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-bold text-slate-700 lg:flex">
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#methode">Méthode</a>
            <a className="nav-link" href="#avis">Avis</a>
            <a className="nav-link" href="#contact">Contact</a>
          </div>

          <a href="#contact" className="clean-button hidden sm:inline-flex">
            Demander un devis <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
      </header>

      <section id="accueil" className="relative isolate min-h-[92vh] pt-28">
        <div className="absolute inset-0 -z-10">
          <img src={heroImage} alt="Professionnelle nettoyant les vitres d'un bâtiment moderne" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/84 to-white/12" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_28%,rgba(14,165,233,0.22),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.45)_42%,rgba(6,45,59,0.14)_100%)]" />
          <div className="absolute -bottom-20 left-0 h-52 w-[110%] -skew-y-3 bg-[#f7fbfa]" />
        </div>

        <div className="container relative grid min-h-[78vh] items-center gap-12 py-16 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl animate-rise">
            <div className="mb-7 inline-flex items-center gap-2 border border-cyan-200/80 bg-white/74 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-800 shadow-sm backdrop-blur [clip-path:polygon(4%_0,100%_0,96%_100%,0_100%)]">
              <MapPin className="h-4 w-4" /> Montpellier & alentours
            </div>
            <h1 className="font-display text-5xl font-black leading-[0.96] tracking-[-0.055em] text-[#062d3b] sm:text-6xl lg:text-7xl">
              Des bâtiments propres qui donnent envie d'entrer.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
              Garnier Nettoyage accompagne les copropriétés, bureaux et bâtiments professionnels à Montpellier avec un service net, régulier et rassurant. Le premier regard sur votre bâtiment compte : nous le rendons impeccable.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href="#contact" className="clean-button clean-button-lg">
                Recevoir un devis rapide <ArrowRight className="h-5 w-5" />
              </a>
              <a href="tel:+33652877766" className="secondary-button">
                <Phone className="h-5 w-5" /> Appeler maintenant
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-none border border-white/80 bg-white/72 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-700" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          <aside className="relative hidden min-h-[560px] lg:block" aria-label="Résumé du service">
            <div className="absolute right-4 top-12 w-72 border border-white/70 bg-white/86 p-6 shadow-2xl shadow-cyan-950/12 backdrop-blur-xl [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]">
              <Star className="mb-4 h-7 w-7 fill-cyan-500 text-cyan-500" />
              <p className="font-display text-3xl font-black leading-none text-[#062d3b]">Le détail qui change tout.</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">Un hall propre, des vitres nettes et des escaliers entretenus améliorent immédiatement l'image de votre bâtiment.</p>
            </div>
            <div className="absolute bottom-4 left-6 w-80 bg-[#062d3b] p-6 text-white shadow-2xl shadow-cyan-950/25 [clip-path:polygon(0_0,94%_0,100%_100%,6%_100%)]">
              <Clock3 className="mb-4 h-8 w-8 text-cyan-300" />
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Réactivité</p>
              <p className="mt-2 font-display text-4xl font-black">Devis simple</p>
              <p className="mt-3 text-sm leading-6 text-cyan-50/86">Expliquez votre besoin en bas de page, la demande est préparée automatiquement par le formulaire.</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="services" className="relative py-24 sm:py-32">
        <div className="container grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative">
            <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-cyan-200/70 blur-3xl" />
            <img src={servicesImage} alt="Collage des services de nettoyage de bâtiments" className="relative z-10 w-full shadow-2xl shadow-cyan-950/14 [clip-path:polygon(0_0,100%_7%,94%_100%,0_92%)]" />
            <div className="absolute -bottom-8 right-2 z-20 bg-white p-5 shadow-xl shadow-cyan-950/10 [clip-path:polygon(7%_0,100%_0,93%_100%,0_100%)]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-700">Spécialiste</p>
              <p className="font-display text-2xl font-black text-[#062d3b]">Bâtiments propres</p>
            </div>
          </div>

          <div>
            <p className="eyebrow">Ce que nous entretenons</p>
            <h2 className="section-title">Un service pensé pour les bâtiments qui doivent toujours faire bonne impression.</h2>
            <p className="section-lead">Garnier Nettoyage ne vend pas seulement des heures de ménage. L'entreprise vend un résultat visible : des espaces communs propres, une sensation d'ordre et une image sérieuse pour les occupants comme pour les visiteurs.</p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {services.map((service) => {
                const Icon = service.icon;
                const isExpanded = expandedService === service.title;
                return (
                  <article key={service.title} className="service-card group">
                    <Icon className="h-8 w-8 text-cyan-700 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
                    <h3 className="mt-5 font-display text-2xl font-black text-[#062d3b]">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{service.shortText}</p>
                    
                    {isExpanded && (
                      <div className="mt-4 border-t border-cyan-200/50 pt-4">
                        <p className="text-sm leading-6 text-slate-600">{service.fullText}</p>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setExpandedService(isExpanded ? null : service.title)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-800 transition-colors"
                    >
                      {isExpanded ? "Moins de détails" : "Plus d'infos"}
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="methode" className="relative bg-[#062d3b] py-24 text-white sm:py-32 [clip-path:polygon(0_5%,100%_0,100%_95%,0_100%)]">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_16%_18%,#22d3ee_0,transparent_30%),linear-gradient(135deg,transparent_0_42%,rgba(255,255,255,.12)_42%_43%,transparent_43%)]" />
        <div className="container relative">
          <div className="max-w-3xl">
            <p className="eyebrow text-cyan-200">Méthode Garnier</p>
            <h2 className="section-title text-white">Clair, régulier, contrôlable : le nettoyage ne doit pas être une inquiétude.</h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {processSteps.map(([number, title, text]) => (
              <article key={number} className="process-card">
                <span className="font-display text-5xl font-black text-cyan-300/70">{number}</span>
                <h3 className="mt-8 text-xl font-black">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-cyan-50/76">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="avis" className="py-24 sm:py-32">
        <div className="container">
          <div className="mb-14">
            <p className="eyebrow">Témoignages clients</p>
            <h2 className="section-title">Pourquoi les clients nous font confiance.</h2>
            <p className="section-lead">Des entreprises, cabinets médicaux et copropriétés nous confient leur nettoyage. Voici ce qu'ils en pensent.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-lg border border-cyan-200/50 bg-white p-6 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-cyan-500 text-cyan-500" />
                  ))}
                </div>
                <p className="text-sm leading-6 text-slate-700 mb-4">"{testimonial.text}"</p>
                <div className="border-t border-cyan-100 pt-4">
                  <p className="font-bold text-[#062d3b]">{testimonial.name}</p>
                  <p className="text-xs text-slate-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="zone" className="relative py-24 sm:py-32 bg-gradient-to-b from-white to-cyan-50/50">
        <div className="container">
          <div className="mb-14 text-center">
            <p className="eyebrow">Zone d'intervention</p>
            <h2 className="section-title">Montpellier et ses alentours</h2>
            <p className="section-lead max-w-2xl mx-auto">Garnier Nettoyage intervient principalement à Montpellier et dans les communes environnantes. Si vous êtes un peu plus loin mais avez un projet important, contactez-nous : nous étudierons votre demande.</p>
          </div>

          <iframe
            width="100%"
            height="400"
            frameBorder="0"
            style={{ border: 0, borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(6, 45, 59, 0.15)' }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11345.954861602856!2d3.8767!3d43.6108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b6a1b1b1b1b1b1%3A0x1b1b1b1b1b1b1b1b!2sMontpellier%2C%20France!5e0!3m2!1sfr!2sfr!4v1234567890"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 mb-3">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-[#062d3b]">Montpellier</h3>
              <p className="text-sm text-slate-600 mt-1">Centre-ville et quartiers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 mb-3">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-[#062d3b]">Communes voisines</h3>
              <p className="text-sm text-slate-600 mt-1">Grabels, Castelnau, etc.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 mb-3">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-[#062d3b]">Au-delà ?</h3>
              <p className="text-sm text-slate-600 mt-1">Nous contacter pour étudier</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <img src={contactImage} alt="Cour intérieure propre avec matériel de nettoyage" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#062d3b]/92 via-[#062d3b]/78 to-[#062d3b]/38" />
        </div>

        <div className="container grid items-start gap-12 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="pt-4 text-white">
            <p className="eyebrow text-cyan-200">Contact</p>
            <h2 className="font-display text-5xl font-black leading-[1] tracking-[-0.045em] sm:text-6xl text-cyan-300" style={{color: '#062d3b'}}>Demandez votre devis de nettoyage.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-cyan-100" style={{color: '#475569'}}>Décrivez votre bâtiment, vos contraintes et vos priorités. Le formulaire prépare une demande claire pour que Garnier Nettoyage puisse vous répondre efficacement.</p>

            <div className="mt-10 space-y-4 text-cyan-50">
              <a href="tel:+33652877766" className="contact-line"><Phone className="h-5 w-5" /> 06 52 87 77 66</a>
              <a href="mailto:contact@garnier-nettoyage.fr" className="contact-line"><Mail className="h-5 w-5" /> contact@garnier-nettoyage.fr</a>
              <p className="contact-line"><MapPin className="h-5 w-5" /> 914 rue de la valsière, 34790 Grabels</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-700">Formulaire fonctionnel</p>
              <h3 className="mt-3 font-display text-4xl font-black tracking-[-0.035em] text-[#062d3b]">Votre demande</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Remplissez le formulaire pour nous décrire votre besoin de nettoyage.</p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="field-label">Nom ou société *
                <input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="field-input" placeholder="Ex. Cabinet Durand" disabled={isSubmitting} />
              </label>
              <label className="field-label">Téléphone *
                <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="field-input" placeholder="06 00 00 00 00" inputMode="tel" disabled={isSubmitting} />
              </label>
              <label className="field-label">Email
                <input value={form.email} onChange={(event) => updateField("email", event.target.value)} className="field-input" placeholder="vous@email.fr" type="email" disabled={isSubmitting} />
              </label>
              <label className="field-label">Type de bâtiment
                <select value={form.building} onChange={(event) => updateField("building", event.target.value)} className="field-input" disabled={isSubmitting}>
                  <option value="">Choisir une option</option>
                  <option>Copropriété / immeuble</option>
                  <option>Bureaux</option>
                  <option>Cabinet médical</option>
                  <option>Après travaux</option>
                  <option>Autre bâtiment</option>
                </select>
              </label>
            </div>

            <label className="field-label mt-5">Besoin de nettoyage *
              <textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} className="field-input min-h-36 resize-none" placeholder="Ex. Nettoyage hebdomadaire d'un hall, escaliers et vitres pour une copropriété à Montpellier..." disabled={isSubmitting} />
            </label>

            <button type="submit" className="clean-button clean-button-lg mt-7 w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer la demande de devis"} <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-[#031c25] py-10 text-cyan-50">
        <div className="container flex flex-col justify-between gap-5 text-sm md:flex-row md:items-center">
          <p className="font-bold">Garnier Nettoyage — SIRET 799 277 272 RM 34</p>
          <p className="text-cyan-100/70">Nettoyage de bâtiments à Montpellier et alentours.</p>
        </div>
      </footer>
    </main>
  );
}
