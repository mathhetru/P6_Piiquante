const express = require("express");
/* installation d'express (framework qui simplifie les taches, en nous permettant de déployer les API plus rapidement) 
l'application Express est fondamentalement une série de fonctions appelées MIDDLEWARE. Chaque élément de middleware reçoit les objets request et response , peut les lire, les analyser et les manipuler, le cas échéant. (COMME CI DESSOUS) */
const mongoose = require("mongoose");
const path = require("path");
const app = express();

app.use(express.json());

const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://user01:user@piiquante.ttqu5xy.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
/*middleware qui autorise toutes les origines, ajoute des headers aux requêtes envoyées vers l'API et d'envoyer des requêtes GET POST PUT Etc... sinon erreur de CORS !!! 
CORS signifie « Cross Origin Resource Sharing ». Il s'agit d'un système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles. Par défaut, les requêtes AJAX sont interdites.*/

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);

module.exports = app;
