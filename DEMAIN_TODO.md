# À faire demain - Garnier Nettoyage 📋

## Avant de commencer
- ✅ Vous avez le code en local sur Windows
- ✅ Vous avez MySQL configuré localement
- ✅ Le site fonctionne en local

---

## Demain : Les 6 étapes pour mettre en ligne

### Étape 1️⃣ : GitHub (~5 min)
```
1. Créer un compte GitHub : https://github.com
2. Créer un nouveau repository : "garnier-nettoyage"
3. Ouvrir PowerShell dans votre dossier du projet
4. Taper :
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/garnier-nettoyage.git
   git push -u origin main
```

### Étape 2️⃣ : Vercel Frontend (~10 min)
```
1. Aller sur https://vercel.com
2. Sign Up avec GitHub
3. Importer votre repository
4. Framework : Vite
5. Deploy !
6. Vous aurez une URL : https://garnier-nettoyage-xyz.vercel.app
```

### Étape 3️⃣ : Railway Backend + Database (~15 min)
```
1. Aller sur https://railway.app
2. Sign Up avec GitHub
3. New Project → Deploy from GitHub
4. Sélectionner votre repository
5. Add MySQL database
6. Railway génère DATABASE_URL automatiquement
7. Deploy !
8. Vous aurez une URL : https://garnier-nettoyage-prod.railway.app
```

### Étape 4️⃣ : Domaine (~10 min + 24-48h)
```
1. Acheter un domaine : https://www.namecheap.com
   Exemple : garnier-nettoyage.fr (~$10/an)
2. Connecter à Vercel :
   - Vercel Settings → Domains
   - Add Domain
   - Ajouter les DNS records chez Namecheap
3. Attendre 24-48h pour la propagation
```

### Étape 5️⃣ : Email Resend (~10 min)
```
1. Aller sur https://resend.com
2. Sign Up (gratuit)
3. Add Domain : garnier-nettoyage.fr
4. Ajouter les DNS records chez Namecheap
5. Créer une adresse : contact@garnier-nettoyage.fr
6. Copier la clé API (re_xxxxx)
7. Ajouter à Railway :
   RESEND_API_KEY=re_xxxxx
   RESEND_FROM_EMAIL=contact@garnier-nettoyage.fr
```

### Étape 6️⃣ : Tester (~5 min)
```
1. Tester le site : https://garnier-nettoyage.fr
2. Tester le formulaire
3. Tester l'admin
4. Tester l'email
```

---

## Ressources à avoir sous la main

- 📄 **DEPLOYMENT_GUIDE.md** (dans votre dossier) - Guide complet détaillé
- 🔑 **Clé Resend** - Vous la recevrez par email
- 🌐 **Domaine** - À acheter chez Namecheap
- 💻 **GitHub, Vercel, Railway** - Comptes à créer

---

## Coûts

| Service | Coût |
|---------|------|
| Vercel | Gratuit |
| Railway | $5-10/mois |
| Domaine | $10/an |
| Email (Resend) | Gratuit (300/mois) |
| **TOTAL** | **~$15-25/mois** |

---

## Si vous êtes bloqué

1. Consultez **DEPLOYMENT_GUIDE.md** (guide complet)
2. Vérifiez les logs :
   - Vercel : Dashboard → Deployments → Logs
   - Railway : Dashboard → Logs
3. Contactez le support du service

---

**Vous êtes prêt ! 🚀**
