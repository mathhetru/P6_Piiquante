const User = require('../models/user'); /* constante qui appelle le fichier user dans le dossier models */
const bcrypt = require('bcrypt'); /* package de chiffrement bcrypt */
const jwt = require('jsonwebtoken'); /* package permettant de créer et vérifier les tokens d'authentification */

/* ici nous créons les middleware. 
Un middleware est un bloc de code qui traite les requêtes et réponses de votre application. Chaque élément de middleware reçoit les objets request et response, peut les lire, les analyser et les manipuler, le cas échéant. (req, res, next) La méthode next permet à chaque middleware de passer l'exécution au middleware suivant. */

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) /* crée un hash crypté du mdp user pour les enregistrer de manière sécurisée dans la bdd. Le 10 : demande« saler » le mdp 10 fois. (+ valeur élevée, + longue exécution, hachage + sécurisé) */
    .then(hash => { /* on recupere le hash du mdp */
      const signupUser = new User({ /* on crée le nouvel utilisateur avec le model mongoose */
        email: req.body.email, /* on récupère l'adresse de cet utilisateur */
        password: hash /* on enregistre le hachage du mdp afin de ne pas stocker le mdp en clair*/
      });
      signupUser.save() /* on sauvegarde l'utilisateur crée */
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}; 

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) /* on recherche dans la bdd l'email de l'utilisateur */
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Paire identifiant / mot de passe incorrecte !' }); /* si on le trouve pas, on renvoie une erreur */
      }
      bcrypt.compare(req.body.password, user.password) /* sinon on compare les hachage de mdp grâce à bcrypt */
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' }); /* si le mdp ne correspond pas, on renvoie une erreur */
          }
          res.status(200).json({ /* sinon on retourne un objet avec les info necessaires à l'authentification de requetes emises à l'utilisateur */
            userId: user._id, /* l'id d'utilisateur */
            token: jwt.sign( /* puis la fonction sign par jsonwebtoken */
              { userId: user._id }, /* 1er argument : l'id de l'utilisateur pour verifier que c'est bien cet user */
              'RANDOM_TOKEN_SECRET', /* 2e argument : clé d'encodage du token (a changer lors de la mise en prod) */
              { expiresIn: '24h' } /* 3e argument : temps d'expiration du token */
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};