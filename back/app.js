const express = require('express');
/* installation d'express (framework qui simplifie les taches, en nous permettant de déployer les API plus rapidement) 
l'application Express est fondamentalement une série de fonctions appelées MIDDLEWARE. Chaque élément de middleware reçoit les objets request et response , peut les lire, les analyser et les manipuler, le cas échéant. (COMME CI DESSOUS) */
const bodyParser = require('body-parser');
const app = express(); 
/* on donne un nom à express = app */ 
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://user01:<password>@piiquante.ttqu5xy.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !')); 

app.use(bodyParser.json());

app.use('/api/auth', userRoutes);

module.exports = app;