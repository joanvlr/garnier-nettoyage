# Guide de Configuration Locale - Garnier Nettoyage

## Prérequis

- **Node.js** 18+ (déjà installé)
- **MySQL** 8.0+ (à installer)
- **pnpm** (déjà installé)

---

## Étape 1 : Installer MySQL

### Sur macOS (avec Homebrew)
```bash
brew install mysql
brew services start mysql
```

### Sur Windows
1. Téléchargez MySQL Community Server : https://dev.mysql.com/downloads/mysql/
2. Lancez l'installateur et suivez les instructions
3. Notez le mot de passe root que vous avez défini

### Sur Linux (Ubuntu/Debian)
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

---

## Étape 2 : Créer la Base de Données

Ouvrez un terminal et connectez-vous à MySQL :

```bash
mysql -u root -p
```

Entrez votre mot de passe root, puis exécutez :

```sql
CREATE DATABASE garnier_nettoyage;
CREATE USER 'garnier_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';
GRANT ALL PRIVILEGES ON garnier_nettoyage.* TO 'garnier_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Étape 3 : Configurer les Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Base de données
DATABASE_URL="mysql://garnier_user:SecurePassword123!@localhost:3306/garnier_nettoyage"

# JWT Secret (générez une clé aléatoire)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Port du serveur
PORT=3000
```

**Important :** Changez `SecurePassword123!` et `JWT_SECRET` en production !

---

## Étape 4 : Initialiser la Base de Données

Dans le dossier du projet :

```bash
# Générer et appliquer les migrations
pnpm db:push

# Créer un compte admin
node scripts/create-admin.mjs
```

Vous verrez :
```
✅ Admin account created successfully!

Login credentials:
Email: admin@garnier-nettoyage.fr
Password: GarnierAdmin2024!
```

---

## Étape 5 : Lancer le Serveur

```bash
pnpm dev
```

Le site sera accessible à : **http://localhost:3000**

---

## Accès Admin

1. Allez sur : **http://localhost:3000/login**
2. Email : `admin@garnier-nettoyage.fr`
3. Mot de passe : `GarnierAdmin2024!`
4. Dashboard : **http://localhost:3000/admin-dashboard**

---

## Troubleshooting

### "Database not available"
- Vérifiez que MySQL est en cours d'exécution
- Vérifiez la `DATABASE_URL` dans `.env.local`
- Testez la connexion : `mysql -u garnier_user -p -h localhost garnier_nettoyage`

### "Port 3000 already in use"
```bash
# Changer le port dans .env.local
PORT=3001
```

### "Migration failed"
```bash
# Réinitialiser les migrations
pnpm db:push --force
```

---

## Déploiement en Production

Une fois développé localement, vous pouvez déployer sur :

- **Railway** : https://railway.app
- **Render** : https://render.com
- **Vercel** : https://vercel.com
- **DigitalOcean** : https://digitalocean.com

Chaque plateforme fournit une base de données MySQL gratuite ou payante.

---

## Variables d'Environnement en Production

Avant de déployer, changez :

```env
JWT_SECRET=your-production-secret-key-min-32-chars
DATABASE_URL=your-production-database-url
NODE_ENV=production
```

**Ne commitez jamais le fichier `.env.local` sur GitHub !**
