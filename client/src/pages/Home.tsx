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
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.15 } },
  viewport: { once: true }
};

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
    shortText: "Entretien complet et régulier des parties communes pour une image irréprochable.",
    fullText: "Garnier Nettoyage prend en charge l'entretien méticuleux des halls, escaliers, ascenseurs, vitrages et locaux techniques. Nous assurons une propreté constante et une hygiène rigoureuse, essentielle pour le confort des résidents et la valorisation de votre patrimoine immobilier.",
    image: "/assets/avant_apres_copro.webp",
  },
  {
    icon: Sparkles,
    title: "Nettoyage de vitre",
    shortText: "Des vitrages impeccables, pour une luminosité et une clarté optimales.",
    fullText: "Nos experts en nettoyage de vitres garantissent une transparence parfaite pour tous types de surfaces vitrées, intérieures comme extérieures. Nous utilisons des techniques professionnelles et des équipements adaptés pour un résultat sans trace, améliorant l'esthétique et la luminosité de vos locaux.",
    image: "/assets/vitre.webp",
  },
  {
    icon: SprayCan,
    title: "Bureaux, Cabinets & Pharmacies",
    shortText: "Hygiène et propreté irréprochables pour vos environnements professionnels et de santé.",
    fullText: "Nous offrons des solutions de nettoyage sur mesure pour les bureaux, cabinets médicaux et pharmacies. Nos protocoles respectent les normes d'hygiène les plus strictes, garantissant des espaces sains, accueillants et propices à la concentration de vos équipes et à la sécurité de vos patients et clients.",
    image: "/assets/pharmacie.webp",
  },
];

const trustPoints = [
  "Expertise locale à Montpellier et sa métropole",
  "Devis sur mesure et réactivité optimale",
  "Propreté certifiée pour tous environnements professionnels",
  "Partenaire fiable pour copropriétés, bureaux et cabinets médicaux",
];

const processSteps = [
  ["01", "Analyse et proposition", "Nous évaluons précisément vos besoins et les spécificités de vos locaux pour élaborer une offre de service sur mesure et un devis transparent."],
  ["02", "Engagement contractuel", "Après validation de notre proposition, nous formalisons notre partenariat par un contrat clair, adapté à vos exigences et garantissant la qualité de nos prestations."],
  ["03", "Exécution rigoureuse", "Nos équipes interviennent selon un planning défini, avec professionnalisme et discrétion, en respectant scrupuleusement le cahier des charges établi."],
  ["04", "Contrôle et ajustement", "Un suivi régulier est mis en place avec un interlocuteur dédié pour assurer votre entière satisfaction et adapter nos services si nécessaire."],
];

const testimonials = [
  {
    name: "Mme. Dubois",
    role: "Présidente du Conseil Syndical, Résidence Les Jardins d'Occitanie",
    text: "Garnier Nettoyage assure une propreté irréprochable de nos parties communes. La réactivité et le professionnalisme de leurs équipes sont un atout majeur pour notre copropriété.",
    rating: 5,
  },
  {
    name: "M. Bernard",
    role: "Gérant d'Immeubles, Agence Immobilière Montpelliéraine",
    text: "Pour nos bureaux et locaux professionnels, Garnier Nettoyage garantit un environnement de travail sain et accueillant. Leur discrétion et l'efficacité de leurs interventions sont très appréciées.",
    rating: 5,
  },
  {
    name: "Dr. Valérie Lefevre",
    role: "Directrice de Cabinet Médical, Montpellier Centre",
    text: "L'hygiène est primordiale dans notre cabinet médical. Garnier Nettoyage respecte scrupuleusement nos protocoles, assurant un environnement stérile et rassurant pour nos patients.",
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
            <div className="flex h-14 w-14 items-center justify-center">
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="100%" height="100%" viewBox="0 0 1028.000000 1024.000000"
                preserveAspectRatio="xMidYMid meet" className="fill-[#062d3b]">
                <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" stroke="none">
                  <path d="M5431 9275 c702 -70 1376 -330 1990 -766 l132 -94 -131 -3 -130 -3 -99
                  64 c-566 367 -1114 570 -1738 643 -173 21 -571 23 -735 5 -475 -52 -885 -174
                  -1318 -390 -748 -373 -1344 -940 -1777 -1691 -541 -938 -682 -2054 -389 -3076
                  388 -1352 1472 -2424 2832 -2798 863 -238 1719 -198 2531 120 962 377 1730
                  1072 2184 1979 308 614 458 1316 418 1960 -42 671 -214 1241 -541 1788 -166
                  280 -343 508 -585 755 -174 178 -172 171 -30 130 76 -21 179 -74 231 -117 92
                  -75 307 -350 453 -578 340 -531 530 -1072 613 -1743 17 -141 17 -709 0 -850
                  -109 -878 -416 -1593 -970 -2255 -109 -129 -388 -405 -522 -517 -625 -517
                  -1378 -848 -2158 -948 -551 -71 -1103 -31 -1652 119 -716 197 -1350 564 -1869
                  1081 -705 703 -1133 1600 -1226 2568 -31 322 -15 741 39 1064 146 860 556
                  1656 1186 2302 719 737 1636 1177 2625 1259 123 10 498 5 636 -8z m3099 -705
                  c-8 -5 -21 -10 -29 -10 -11 0 -10 5 4 20 13 15 22 17 29 10 8 -8 6 -14 -4 -20z
                  m-100 -58 c0 -5 -11 -14 -25 -20 -26 -12 -33 -4 -13 16 14 14 38 16 38 4z
                  m245 -32 c-3 -5 -13 -10 -21 -10 -8 0 -12 5 -9 10 3 6 13 10 21 10 8 0 12 -4
                  9 -10z m-365 -40 c0 -5 -15 -17 -32 -26 l-33 -17 24 27 c25 27 41 33 41 16z
                  m140 -50 c-8 -6 -22 -10 -30 -9 -9 0 -5 6 10 14 27 14 44 10 20 -5z m-270 -28
                  c0 -5 -12 -14 -27 -21 -28 -13 -28 -13 -9 8 20 22 36 27 36 13z m160 -12 c0
                  -5 -3 -10 -7 -10 -5 0 -19 -3 -33 -6 -24 -5 -24 -5 -6 10 22 18 46 21 46 6z
                  m325 -40 c-3 -5 -18 -10 -33 -10 -21 0 -24 2 -12 10 20 13 53 13 45 0z m-975
                  -150 c0 -118 -2 -140 -15 -140 -13 0 -15 22 -15 140 0 118 2 140 15 140 13 0
                  15 -22 15 -140z m365 130 c-3 -5 -16 -15 -28 -21 -21 -10 -21 -9 2 10 25 23
                  36 27 26 11z m140 0 c-27 -12 -43 -12 -25 0 8 5 22 9 30 9 10 0 8 -3 -5 -9z
                  m-585 -143 l0 -144 -42 -12 c-24 -7 -75 -28 -115 -46 -153 -70 -228 -140 -260
                  -242 l-17 -53 -177 0 -177 0 -12 51 c-24 101 -98 148 -242 157 -103 6 -121 18
                  -116 79 3 36 5 39 54 54 64 21 109 49 231 147 181 146 198 150 581 151 l292 1
                  0 -143z m900 133 c0 -5 -12 -10 -26 -10 -14 0 -23 4 -19 10 3 6 15 10 26 10
                  10 0 19 -4 19 -10z m-642 -17 l33 -5 -3 -86 -3 -86 -40 -12 c-23 -6 -60 -15
                  -82 -19 -38 -6 -41 -5 -36 14 3 11 17 24 32 30 l26 9 -27 1 c-26 1 -27 3 -27
                  61 l1 60 31 1 32 1 -37 10 c-23 6 -38 16 -38 25 0 16 35 15 138 -4z m502 -3
                  c-8 -5 -26 -10 -40 -10 -20 0 -22 2 -10 10 8 5 26 10 40 10 20 0 22 -2 -10 -10z
                  m-315 -20 c-11 -5 -27 -9 -35 -9 -9 0 -8 4 5 9 11 5 27 9 35 9 9 0 8 -4 -5 -9z
                  m175 -10 c-36 -12 -62 -12 -55 0 3 6 23 10 43 9 33 -1 34 -2 12 -9z m-165 -30
                  c-16 -4 -41 -8 -55 -8 l-25 0 25 8 c14 4 39 8 55 8 l30 0 -30 -8z m420 -29 c9
                  -16 -15 -23 -53 -16 -31 6 -34 9 -17 15 28 12 63 12 70 1z m160 0 c9 -16 -14
                  -23 -52 -16 -27 5 -33 9 -22 16 18 12 66 12 74 0z m155 0 c0 -16 -17 -21 -50
                  -15 -22 5 -28 9 -18 15 18 12 68 11 68 0z m-705 -11 c-8 -13 -55 -13 -75 0
                  -11 7 -2 10 33 10 30 0 46 -4 42 -10z m207 -2 c-8 -8 -23 -8 -54 -1 l-43 11
                  55 1 c41 1 51 -2 42 -11z m-222 -49 c25 -14 -9 -10 -50 7 l-35 14 35 -6 c19
                  -4 42 -10 50 -15z m-34 -34 c10 -8 14 -15 8 -15 -5 0 -19 7 -30 15 -10 8 -14
                  15 -8 15 5 0 19 -7 30 -15z m186 0 c-3 -11 -39 -8 -62 6 -10 6 -3 8 25 7 22
                  -2 39 -7 37 -13z m138 -25 c22 -14 0 -30 -27 -19 -13 4 -23 13 -23 19 0 13 30
                  13 50 0z m-176 -61 c-3 -5 -16 -2 -30 7 -32 22 -30 25 6 13 16 -6 27 -15 24
                  -20z m-534 -39 c25 -25 25 -29 -6 -71 -29 -39 -28 -53 12 -189 35 -115 101
                  -251 163 -332 55 -73 61 -88 32 -88 -53 0 -227 175 -300 301 -26 46 -47 69
                  -73 82 l-36 17 24 58 c31 75 30 90 -7 128 l-32 33 39 17 c93 40 150 64 157 64
                  4 0 16 -9 27 -20z m646 -15 c16 -12 16 -14 3 -15 -9 0 -22 7 -29 15 -16 19 0
                  19 26 0z m132 -73 c6 -19 -13 -14 -33 8 -18 20 -18 21 5 12 13 -5 26 -14 28
                  -20z m-1020 -32 c37 -22 38 -27 17 -76 -12 -29 -19 -35 -32 -28 -10 4 -44 16
                  -75 27 -32 11 -55 24 -52 29 9 15 86 68 98 68 6 0 26 -9 44 -20z m1127 -13
                  c11 -8 14 -16 8 -20 -6 -4 -18 2 -28 13 -21 23 -8 27 20 7z m-1341 -223 c3 -9
                  6 -18 6 -20 0 -2 -92 -4 -205 -4 -164 0 -205 3 -205 13 0 8 3 17 7 20 3 4 93
                  7 199 7 166 0 193 -2 198 -16z m34 -70 c21 -14 22 -22 22 -140 l0 -124 -260 0
                  -260 0 0 124 c0 166 -18 156 260 156 179 0 219 -3 238 -16z m8 -358 c47 -47
                  46 -88 -2 -152 -47 -62 -59 -91 -79 -200 -33 -170 -6 -285 113 -487 107 -180
                  139 -264 162 -422 6 -43 10 -529 10 -1283 l0 -1213 -112 3 -112 3 -134 225
                  c-74 124 -229 385 -345 580 -207 348 -273 461 -888 1497 -167 282 -306 513
                  -309 513 -3 0 -4 -580 -2 -1290 l2 -1290 -95 0 -95 0 0 1358 c0 1138 -2 1373
                  -15 1454 -16 105 -45 199 -73 238 -31 42 -96 85 -155 104 -55 17 -57 19 -57
                  52 l0 34 350 0 349 0 42 -72 c51 -88 402 -677 1203 -2015 143 -238 262 -433
                  265 -433 3 0 6 332 5 738 -1 633 -3 748 -17 812 -25 118 -51 182 -125 308
                  -119 201 -140 266 -149 457 -3 72 -10 136 -16 143 -6 8 -46 12 -133 12 -146 0
                  -147 0 -200 -116 -87 -192 -160 -460 -171 -632 l-6 -102 -44 76 c-37 66 -43
                  84 -43 134 0 166 94 453 263 803 63 131 92 180 109 186 13 6 124 10 247 10
                  l223 1 34 -34z m-3276 -207 c570 -70 934 -359 958 -761 17 -294 -151 -492
                  -402 -476 -158 10 -269 106 -283 243 -10 91 12 127 120 205 66 47 82 83 82
                  179 0 75 -4 94 -29 146 -63 128 -213 236 -401 287 -117 31 -362 31 -489 0
                  -491 -123 -806 -571 -912 -1297 -24 -163 -24 -494 0 -660 61 -427 207 -762
                  437 -1000 142 -147 285 -235 465 -287 114 -33 343 -33 457 0 236 68 380 207
                  422 407 18 84 21 651 5 753 -26 156 -97 257 -215 302 -84 32 -226 33 -306 1
                  -113 -43 -178 -111 -199 -205 -32 -146 110 -283 230 -221 29 15 30 15 50 -17
                  42 -69 18 -202 -48 -271 -52 -55 -98 -72 -197 -72 -78 0 -97 4 -141 27 -195
                  102 -239 411 -92 640 72 114 228 218 386 259 70 18 116 19 694 19 l618 0 0
                  -39 c0 -37 -2 -39 -37 -46 -123 -23 -187 -110 -212 -289 -7 -46 -11 -259 -11
                  -521 l0 -444 -77 -67 c-310 -264 -713 -406 -1153 -407 -466 0 -870 168 -1181
                  491 -218 226 -354 476 -433 792 -108 438 -58 970 130 1369 254 541 746 892
                  1344 960 109 12 323 13 420 0z m1634 -3407 c12 -14 17 -43 20 -108 l4 -89 398
                  -3 c392 -2 398 -3 421 -24 16 -15 23 -33 23 -60 l0 -38 -1009 0 c-911 0 -1009
                  2 -1015 16 -12 30 -6 55 19 79 l24 25 396 0 395 0 0 88 c0 133 -1 132 169 132
                  121 0 140 -2 155 -18z m 863 -481 c12 -45 41 -117 63 -161 22 -44 40 -82 40
                  -85 0 -3 -33 -5 -72 -3 l-73 3 -58 113 c-32 63 -60 112 -62 110 -3 -3 30 -177
                  41 -210 5 -17 -8 -18 -170 -18 l-174 0 -42 108 c-23 59 -45 109 -47 112 -5 5
                  0 -66 14 -172 l6 -48 -225 0 -225 0 -13 105 c-7 58 -16 105 -20 105 -4 0 -11
                  -46 -16 -102 l-9 -103 -219 -3 -219 -2 7 112 6 113 -42 -112 -43 -113 -172 0
                  c-95 0 -173 4 -173 9 0 5 9 53 20 106 11 53 20 102 19 109 0 6 -27 -42 -60
                  -106 l-59 -118 -76 0 c-42 0 -74 3 -72 8 2 4 24 50 50 102 26 52 54 126 64
                  163 l17 68 985 -5 985 -4 24 -81z"/>
                  <path d="M6973 8221 c-28 -9 -69 -29 -90 -43 -36 -24 -177 -138 -198 -161 -13
                  -13 53 26 126 74 153 103 192 112 527 125 100 3 182 10 182 15 0 5 -111 9
                  -247 9 -212 -1 -256 -3 -300 -19z"/>
                  <path d="M6492 7919 c3 -10 28 -16 79 -20 147 -13 225 -58 276 -160 32 -62 33
                  -63 33 -29 -1 54 -33 115 -81 149 -54 40 -123 60 -228 68 -69 5 -83 4 -79 -8z"/>
                  <path d="M6775 7467 c-10 -40 -1 -160 13 -165 9 -3 12 20 12 92 0 91 -12 126
                  -25 73z"/>
                  <path d="M6840 7390 c0 -77 3 -101 13 -97 8 2 12 31 12 97 0 66 -4 95 -12 98
                  -10 3 -13 -21 -13 -98z"/>
                  <path d="M6910 7395 c0 -78 3 -95 15 -95 12 0 15 17 15 95 0 78 -3 95 -15 95
                  -12 0 -15 -17 -15 -95z"/>
                  <path d="M6986 7444 c-10 -75 -7 -131 7 -143 23 -18 27 -2 27 96 0 72 -3 93
                  -14 93 -8 0 -16 -17 -20 -46z"/>
                  <path d="M7067 7484 c-4 -4 -7 -47 -7 -96 0 -82 1 -88 20 -88 20 0 21 5 18 92
                  -3 84 -12 111 -31 92z"/>
                  <path d="M7142 7395 c4 -127 22 -129 26 -2 2 83 0 97 -13 97 -13 0 -15 -14
                  -13 -95z"/>
                  <path d="M7205 7467 c-9 -36 -1 -172 10 -170 14 4 19 193 6 193 -6 0 -13 -10
                  -16 -23z"/>
                </g>
              </svg>
            </div>
            <span className="leading-tight">
              <span className="block font-display text-xl font-black tracking-tight text-[#062d3b]">Garnier</span>
              <span className="block text-xs font-bold uppercase tracking-[0.28em] text-cyan-700">Nettoyage</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 text-sm font-bold text-slate-700 lg:flex">
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#methode">Méthode</a>
            <a className="nav-link" href="#avis">Avis</a>
            <a className="nav-link" href="#contact">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#contact" className="clean-button hidden sm:inline-flex">
              Demander un devis <ArrowRight className="h-4 w-4" />
            </a>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-[#062d3b]">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] border-l-cyan-100 bg-white p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                      <span className="text-lg font-bold text-[#062d3b]">Menu</span>
                    </div>
                    <div className="flex flex-col gap-2 p-6">
                      {[
                        { href: "#accueil", label: "Accueil" },
                        { href: "#services", label: "Services" },
                        { href: "#methode", label: "Méthode" },
                        { href: "#avis", label: "Avis" },
                        { href: "#contact", label: "Contact & Devis" },
                      ].map((link) => (
                        <SheetClose asChild key={link.href}>
                          <a
                            href={link.href}
                            className="flex items-center py-4 text-lg font-medium text-slate-700 transition-colors hover:text-[#062d3b] hover:bg-slate-50 rounded-lg px-4"
                          >
                            {link.label}
                          </a>
                        </SheetClose>
                      ))}
                    </div>
                    <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50">
                      <p className="text-xs text-slate-500 text-center">
                        Garnier Nettoyage © 2026<br/>Montpellier & Alentours
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
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
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-7 inline-flex items-center gap-2 border border-cyan-200/80 bg-white/74 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-800 shadow-sm backdrop-blur [clip-path:polygon(4%_0,100%_0,96%_100%,0_100%)]">
              <MapPin className="h-4 w-4" /> Montpellier & alentours
            </div>
            <h1 className="font-display text-5xl font-black leading-[0.96] tracking-[-0.055em] text-[#062d3b] sm:text-6xl lg:text-7xl">
              Votre partenaire propreté pour des espaces professionnels impeccables.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
              Garnier Nettoyage offre des solutions d'entretien sur mesure pour les copropriétés, bureaux et cabinets médicaux à Montpellier. Nous nous engageons à créer des environnements sains, valorisants et accueillants, essentiels pour le bien-être de vos occupants et l'image de votre établissement.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href="#contact" className="clean-button clean-button-lg">
                Recevoir un devis rapide <ArrowRight className="h-5 w-5" />
              </a>
              <a href="tel:+33652877766" className="secondary-button">
                <Phone className="h-5 w-5" /> Appeler maintenant
              </a>
            </div>

            <motion.div 
              className="mt-10 grid gap-3 sm:grid-cols-2"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {trustPoints.map((point) => (
                <motion.div 
                  key={point} 
                  variants={fadeInUp}
                  className="flex items-center gap-3 rounded-none border border-white/80 bg-white/72 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-700" />
                  {point}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

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
            <div className="absolute -bottom-12 -right-4 z-20 w-40 overflow-hidden rounded-xl border-4 border-white shadow-2xl transition-transform hover:scale-105 sm:w-48">
              <img src="/assets/aspirateur.webp" alt="Matériel professionnel" className="w-full h-auto" />
              <div className="bg-white p-2 text-center sm:p-3">
                <p className="text-[8px] font-black uppercase tracking-widest text-cyan-700 sm:text-[10px]">Matériel Pro</p>
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow">Ce que nous entretenons</p>
            <h2 className="section-title">Un service pensé pour les bâtiments qui doivent toujours faire bonne impression.</h2>
            <p className="section-lead">Garnier Nettoyage ne vend pas seulement des heures de ménage. L'entreprise vend un résultat visible : des espaces communs propres, une sensation d'ordre et une image sérieuse pour les occupants comme pour les visiteurs.</p>

            <motion.div 
              className="mt-10 grid gap-5 sm:grid-cols-2"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
            >
              {services.map((service) => {
                const Icon = service.icon;
                const isExpanded = expandedService === service.title;
                return (
                  <motion.article 
                    key={service.title} 
                    variants={scaleIn}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    className="service-card group"
                  >
                    <Icon className="h-8 w-8 text-cyan-700 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
                    <h3 className="mt-5 font-display text-2xl font-black text-[#062d3b]">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{service.shortText}</p>
                    
                    <div className="flex flex-col relative z-10">
                      {isExpanded && (
                        <div className="mt-4 border-t border-cyan-200/50 pt-4 space-y-6">
                          <p className="text-sm leading-6 text-slate-700 font-medium">{service.fullText}</p>
                          {service.image && (
                            <div className="overflow-hidden rounded-xl border-2 border-cyan-50 shadow-md bg-white">
                              <img src={service.image} alt={service.title} className="w-full h-auto object-cover" />
                            </div>
                          )}
                        </div>
                      )}
                      
                      <button
                        onClick={() => setExpandedService(isExpanded ? null : service.title)}
                        className={`mt-6 inline-flex items-center gap-2 text-sm font-extrabold transition-all duration-300 w-fit px-4 py-2 rounded-full shadow-sm ${
                          isExpanded 
                          ? "bg-cyan-50 text-cyan-800 border-2 border-cyan-200 hover:bg-cyan-100 translate-y-1" 
                          : "text-cyan-700 hover:text-cyan-900 hover:gap-3"
                        }`}
                        style={{ position: 'relative', zIndex: 50 }}
                      >
                        {isExpanded ? "Réduire les détails" : "En savoir plus"}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="methode" className="relative bg-[#062d3b] py-24 text-white sm:py-32 [clip-path:polygon(0_5%,100%_0,100%_95%,0_100%)]">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_16%_18%,#22d3ee_0,transparent_30%),linear-gradient(135deg,transparent_0_42%,rgba(255,255,255,.12)_42%_43%,transparent_43%)]" />
        <div className="container relative">
          <div className="max-w-3xl">
            <motion.p variants={fadeInUp} initial="initial" whileInView="whileInView" className="eyebrow text-cyan-200">Méthode Garnier</motion.p>
            <motion.h2 variants={fadeInUp} initial="initial" whileInView="whileInView" className="section-title text-white">Clair, régulier, contrôlable : le nettoyage ne doit pas être une inquiétude.</motion.h2>
          </div>

          <motion.div 
            className="mt-12 grid gap-5 md:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {processSteps.map(([number, title, text]) => (
              <motion.article key={number} variants={fadeInUp} className="process-card">
                <span className="font-display text-5xl font-black text-cyan-300/70">{number}</span>
                <h3 className="mt-8 text-xl font-black">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-cyan-50/76">{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="avis" className="py-24 sm:py-32">
        <div className="container">
          <motion.div 
            className="mb-14"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <p className="eyebrow">Témoignages clients</p>
            <h2 className="section-title">Pourquoi les clients nous font confiance.</h2>
            <p className="section-lead">Des entreprises, cabinets médicaux et copropriétés nous confient leur nettoyage. Voici ce qu'ils en pensent.</p>
          </motion.div>

          <motion.div 
            className="grid gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} variants={scaleIn} className="rounded-lg border border-cyan-200/50 bg-white p-6 shadow-sm">
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
              </motion.div>
            ))}
          </motion.div>
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
