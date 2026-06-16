# Garnier Nettoyage — Refonte SaaS TODO

## Refonte SaaS (Self-Hosted)
- [x] Supprimer toutes les dépendances Manus OAuth
- [x] Implémenter authentification interne avec JWT + bcryptjs
- [x] Créer page de login avec email/password
- [x] Refondre le schéma de base de données pour authentification interne
- [x] Ajouter table users avec role (admin/user)
- [x] Créer procédures tRPC : auth.login, auth.logout, auth.me
- [x] Créer procédures tRPC : quotes.getAll, quotes.updateStatus, quotes.delete
- [x] Créer procédures tRPC : messages.send

## Interface Admin
- [x] Créer page AdminDashboard avec tableau des demandes
- [x] Ajouter barre de recherche (nom, email, téléphone, bâtiment)
- [x] Ajouter filtre par statut (Nouvelle, Contactée, Complétée, Rejetée)
- [x] Ajouter système de messages (dialog)
- [x] Ajouter bouton supprimer demande
- [x] Ajouter lien téléchargement fichiers
- [x] Ajouter bouton déconnexion

## Tests & Vérification
- [x] Créer test auth.login avec validation email
- [x] Créer test auth.me (authenticated/unauthenticated)
- [x] Créer test auth.logout
- [x] Créer test quotes.getAll (require authentication)
- [x] Tous les tests passent (5/5)

## Futures Améliorations (Optionnelles)
- [ ] Ajouter filtre par date
- [ ] Ajouter système de tri par colonne
- [ ] Ajouter bouton "Relancer" (email de suivi)
- [ ] Ajouter export CSV des demandes
- [ ] Ajouter pagination au tableau
- [ ] Ajouter système de rôles (admin/manager/user)
- [ ] Ajouter 2FA (authentification deux facteurs)
- [ ] Ajouter reset password par email

## Setup Local
- [x] Créer guide de configuration MySQL local (SETUP_LOCAL.md)
- [x] Créer script de création du compte admin
- [x] Documenter les variables d'environnement

## Déploiement
- [ ] Préparer guide de déploiement (Vercel/Railway/Render)
- [ ] Configurer variables d'environnement
- [ ] Tester en production


## Mises à jour du contenu (demandées par l'utilisateur)

- [ ] Ajouter le numéro de téléphone : 06 52 87 77 66
- [ ] Ajouter l'adresse : 914 rue de la valsière résidence les portes du soleil, 34790 Grabels
- [ ] Ajouter le SIRET quelque part sur le site
- [ ] Mettre à jour les services : entretien copropriété, nettoyage de vitre, entretien bureau et cabinet médicaux, remise en état
- [ ] Retirer la mention "vitrine" en bas du site
- [ ] Ajouter une carte interactive montrant Montpellier et ses alentours avec zone bleue de couverture
- [ ] Ajouter une section "Avis/Témoignages"
- [ ] Améliorer le menu avec une section Services déroulante
- [ ] Consulter https://au-clean.fr pour s'inspirer (sans copier les textes)
- [ ] Remplacer les images IA par des vraies photos (quand l'utilisateur les enverra)
- [ ] NE PAS ajouter de section recrutement pour l'instant
