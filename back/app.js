const express = require("express"); /* installation d'express (framework qui simplifie les taches, en nous permettant de déployer les API plus rapidement) l'application Express est fondamentalement une série de fonctions appelées MIDDLEWARE. Chaque élément de middleware reçoit les objets request et response, peut les lire, les analyser et les manipuler.(req, res, next) */
const mongoose = require("mongoose"); /* Mongoose facilite les interactions avec la bdd MongoDB. Il nous permet de valider le format des données ; de gérer les relations entre les documents ; de communiquer directement avec la bdd pour la lecture et l'écriture des documents */
const path = require("path"); /* path fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires */
const app = express(); /* constante qui appelle express */
const cors = require('cors'); /* installation de cors (CORS signifie « Cross Origin Resource Sharing ». Il s'agit d'un système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles.) Par défaut, les requêtes AJAX sont interdites */
const dotenv = require('dotenv'); /* dotenv charge les variables d'environnement d'un fichier .env dans un process.env */
dotenv.config(); /* charge les variables d'environnement */

app.use(cors()); /* app utilise le module cors */ 
app.use(express.json()); /* app utilise le module express */ 

const userRoutes = require("./routes/user"); /* constante qui appelle le fichier user dans le dossier routes */
const saucesRoutes = require("./routes/sauces"); /* constante qui appelle le fichier sauces dans le dossier routes */

const myAccount = process.env.account; /* constante qui va chercher la variable d'environnement account dans le fichier .env */
const myMdp = process.env.mdp; /* constante qui va chercher la variable d'environnement mdp dans le fichier .env */
const myDatabase = process.env.database; /* constante qui va chercher la variable d'environnement database dans le fichier .env */

mongoose.connect(
    `mongodb+srv://${myAccount}:${myMdp}@${myDatabase}.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !")); /* permet de connecter l'API à la bdd */

app.use("/images", express.static(path.join(__dirname, "images"))); /* indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images */
app.use("/api/auth", userRoutes); /* "/route attendu par le front-end", userRoutes */
app.use("/api", saucesRoutes); /* "/route attendu par le front-end", saucesRoutes */

module.exports = app; /* export app pour y accéder depuis d'autres fichiers de notre projet */
