# Guide Complet de Déploiement - Garnier Nettoyage

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Étape 1 : Préparer GitHub](#étape-1--préparer-github)
3. [Étape 2 : Déployer le Frontend sur Vercel](#étape-2--déployer-le-frontend-sur-vercel)
4. [Étape 3 : Déployer le Backend + Database sur Railway](#étape-3--déployer-le-backend--database-sur-railway)
5. [Étape 4 : Configurer votre domaine](#étape-4--configurer-votre-domaine)
6. [Étape 5 : Configurer l'email avec Resend](#étape-5--configurer-lemail-avec-resend)
7. [Étape 6 : Tester et vérifier](#étape-6--tester-et-vérifier)

---

## Vue d'ensemble

**Architecture finale :**
```
Frontend (React) → Vercel (gratuit)
                ↓
Backend (Node.js/Express) → Railway ($5-10/mois)
                ↓
Database (MySQL) → Railway ($10-15/mois)
                ↓
Email → Resend (gratuit)

Domaine : garnier-nettoyage.fr (votre domaine)
```

**Coût total : ~$15-25/mois**

---

## Étape 1 : Préparer GitHub

### 1.1 Créer un compte GitHub
1. Allez sur https://github.com
2. Cliquez sur **"Sign up"**
3. Créez un compte avec votre email

### 1.2 Créer un nouveau repository
1. Allez sur https://github.com/new
2. Remplissez :
   - **Repository name** : `garnier-nettoyage`
   - **Description** : `Site web Garnier Nettoyage`
   - **Public** (cochez cette option)
3. Cliquez sur **"Create repository"**

### 1.3 Pousser votre code sur GitHub

Ouvrez **PowerShell** dans votre dossier du projet et tapez :

```powershell
git init
git add .
git commit -m "Initial commit: Garnier Nettoyage SaaS"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/garnier-nettoyage.git
git push -u origin main
```

**Remplacez `VOTRE_USERNAME`** par votre nom d'utilisateur GitHub.

---

## Étape 2 : Déployer le Frontend sur Vercel

### 2.1 Créer un compte Vercel
1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories

### 2.2 Importer votre projet
1. Sur le dashboard Vercel, cliquez sur **"Add New"** → **"Project"**
2. Sélectionnez votre repository `garnier-nettoyage`
3. Cliquez sur **"Import"**

### 2.3 Configurer le déploiement
1. **Framework Preset** : Sélectionnez **"Vite"**
2. **Build Command** : `npm run build`
3. **Output Directory** : `dist`
4. **Environment Variables** : Laissez vide pour l'instant

### 2.4 Déployer
1. Cliquez sur **"Deploy"**
2. Attendez que le déploiement se termine (~2 minutes)
3. Vous verrez une URL comme : `https://garnier-nettoyage-xyz.vercel.app`

**Le frontend est en ligne !** ✅

---

## Étape 3 : Déployer le Backend + Database sur Railway

### 3.1 Créer un compte Railway
1. Allez sur https://railway.app
2. Cliquez sur **"Start Project"**
3. Connectez-vous avec GitHub

### 3.2 Créer une nouvelle application
1. Cliquez sur **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Sélectionnez votre repository `garnier-nettoyage`

### 3.3 Ajouter une base de données MySQL
1. Dans le dashboard Railway, cliquez sur **"Add"**
2. Sélectionnez **"MySQL"**
3. Railway créera automatiquement une base de données

### 3.4 Configurer les variables d'environnement
1. Dans Railway, allez dans **"Variables"**
2. Ajoutez ces variables :

```
DATABASE_URL=<Railway va générer cette URL automatiquement>
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
PORT=3000
```

**Railway génère automatiquement `DATABASE_URL`** quand vous ajoutez MySQL.

### 3.5 Configurer le build
1. Allez dans **"Settings"**
2. **Start Command** : `npm run start`
3. **Build Command** : `npm run build`

### 3.6 Déployer
1. Railway déploie automatiquement quand vous poussez sur GitHub
2. Attendez que le déploiement se termine (~3-5 minutes)
3. Vous verrez une URL comme : `https://garnier-nettoyage-prod.railway.app`

**Le backend est en ligne !** ✅

---

## Étape 4 : Configurer votre domaine

### 4.1 Acheter un domaine
1. Allez sur https://www.namecheap.com ou https://www.ovh.com
2. Recherchez `garnier-nettoyage.fr`
3. Achetez le domaine (~$10/an)

### 4.2 Connecter le domaine à Vercel (Frontend)
1. Dans Vercel, allez dans **"Settings"** → **"Domains"**
2. Cliquez sur **"Add Domain"**
3. Entrez : `garnier-nettoyage.fr`
4. Vercel vous donnera les **DNS records** à ajouter
5. Allez chez votre registraire (Namecheap/OVH) et ajoutez les DNS records
6. Attendez 24-48h pour la propagation DNS

### 4.3 Configurer le backend sur votre domaine
1. Vous pouvez utiliser un sous-domaine : `api.garnier-nettoyage.fr`
2. Chez votre registraire, créez un **CNAME record** :
   - **Name** : `api`
   - **Value** : `<votre-url-railway>.railway.app`

---

## Étape 5 : Configurer l'email avec Resend

### 5.1 Créer un compte Resend
1. Allez sur https://resend.com
2. Cliquez sur **"Sign Up"**
3. Créez un compte gratuit

### 5.2 Ajouter votre domaine
1. Dans Resend, allez dans **"Domains"**
2. Cliquez sur **"Add Domain"**
3. Entrez : `garnier-nettoyage.fr`
4. Resend vous donnera les **DNS records**
5. Ajoutez ces records chez votre registraire

### 5.3 Créer une adresse email
1. Dans Resend, créez l'adresse : `contact@garnier-nettoyage.fr`
2. Vous recevrez une **clé API** (elle ressemble à : `re_xxxxxxxxxxxxx`)

### 5.4 Ajouter la clé API à Railway
1. Dans Railway, allez dans **"Variables"**
2. Ajoutez :
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=contact@garnier-nettoyage.fr
```

**Remplacez** `re_xxxxxxxxxxxxx` par votre vraie clé API.

---

## Étape 6 : Tester et vérifier

### 6.1 Tester le frontend
1. Allez sur `https://garnier-nettoyage.fr`
2. Vérifiez que le site s'affiche correctement
3. Testez le formulaire de contact

### 6.2 Tester le backend
1. Allez sur `https://api.garnier-nettoyage.fr/api/trpc/auth.me`
2. Vous devriez voir une réponse JSON

### 6.3 Tester l'email
1. Connectez-vous au dashboard admin
2. Créez une demande de devis
3. Envoyez un message par email
4. Vérifiez que l'email arrive

### 6.4 Vérifier les logs
- **Vercel** : Dashboard → "Deployments" → "Logs"
- **Railway** : Dashboard → "Logs"

---

## Résumé des URLs finales

| Composant | URL |
|-----------|-----|
| **Frontend** | https://garnier-nettoyage.fr |
| **Admin** | https://garnier-nettoyage.fr/login |
| **Backend API** | https://api.garnier-nettoyage.fr |
| **Email** | contact@garnier-nettoyage.fr |

---

## Dépannage

### Le frontend ne se connecte pas au backend
- Vérifiez que l'URL du backend est correcte dans le code
- Vérifiez les CORS (Cross-Origin Resource Sharing)

### Les emails ne s'envoient pas
- Vérifiez la clé API Resend
- Vérifiez que le domaine est validé dans Resend
- Vérifiez les logs Railway

### Le domaine ne fonctionne pas
- Attendez 24-48h pour la propagation DNS
- Vérifiez les DNS records chez votre registraire

---

## Support

Si vous avez des questions, contactez :
- **Vercel** : https://vercel.com/support
- **Railway** : https://railway.app/support
- **Resend** : https://resend.com/support

---

**Bon déploiement ! 🚀**
