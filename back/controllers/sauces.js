const Sauce = require("../models/Sauces"); /* appelle du fichier Sauces dans le dossier models */
const fs = require("fs"); /* package qui fournit des fonctionnalités très utiles pour accéder et interagir avec le système de fichiers */

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); /* récupère les informations du formulaire */
  delete sauceObject._id; /* supprimer le faux id envoyé par le front */
  const sauce = new Sauce({
    ...sauceObject, /* Le spread ... est utilisé pour faire une copie de tous les éléments de sauceObject */
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, /* on ajoute l'image */
    likes:0, /* on ajoute le like à 0 */
    dislikes:0 /* on ajoute le dislike à 0*/
  });
  sauce.save() /* on sauvegarde la sauce */
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) /* on recherche dans la bdd la sauce avec son id */
    .then((sauce) => { /* et on la récupère */
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find() /* on recherche dans la bdd toutes les sauces */
    .then((sauces) => { /* et on les récupère */
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  var sauceObject = {}; /* on crée un objet SauceObject vide */
  if (req.file) {  /* si on upload un fichier */
    sauceObject = { /* alors on récupère notre objet  */
        ...JSON.parse(req.body.sauce), /* en parsant la chaine de caractères (transforme un objet stringifié en Object JavaScript exploitable) */
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, /* et on recréé l'URL complète de l'image */
    } 
  } else { /* sinon si il n'y a pas de fichier transmis */
    sauceObject = { ...req.body }; /* on récupère le body de la requête */
  }
  delete sauceObject._userId; /* on supprime l'user id recupéré par le nouvel objet par sécurité */
  Sauce.findOne ({_id: req.params.id}) /* on recherche la sauce grâce à l'id récupéré dans la bdd */
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) { /* si l'user id récupéré dans la bdd n'est pas le même que l'id user de l'auth */
        res.status(401).json({ message : 'action non-autorisée'}); /* alors c'est une action non authorisée */ 
      } else {
        Sauce.updateOne( /* sinon c'est ok, on met ensuite à jour */
          { _id: req.params.id },/* 1er argument : id de l'objet que l'on souhaite modifier */
          { ...sauceObject, _id: req.params.id } /* 2nd argument : nouvelle version de l'objet, l'id correspond à celui da la bdd */
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    })
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) /* on recherche dans la bdd la sauce avec son id */
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likedSauce = (req, res, next) => {
  if (req.body.like == 1 ) {
    Sauce.updateOne(
      { _id: req.params.id }, 
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }}
    )
    .then(() => res.status(200).json({ message: 'Vous avez liké la sauce ! :)' }))
    .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like == -1 ) {
    Sauce.updateOne(
      { _id: req.params.id }, 
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }}
    )
    .then(() => res.status(200).json({ message: 'Vous avez disliké la sauce ! :(' }))
    .catch((error) => res.status(400).json({ error }));
  } else {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.usersLiked.includes(req.body.userId)){ /* si l'userId est présent dans les usersLiked alors */
          Sauce.updateOne( /* on modifie celui dont l'ID est égal à l'ID envoyé dans les paramètres de requêtes en mettant un like a -1 et en enlevant userId des usersLiked */
          { _id: req.params.id }, 
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }}
      )
      .then(() => res.status(200).json({ message: 'Vous avez disliké la sauce ! :(' }))
      .catch((error) => res.status(400).json({ error }));
      } 
      else if (sauce.usersDisliked.includes(req.body.userId)){ /* si l'userId est présent dans les usersDisliked alors */
        Sauce.updateOne( /* on modifie celui dont l'ID est égal à l'ID envoyé dans les paramètres de requêtes en mettant un dislike a -1 et en enlevant userId des usersDisliked */
        { _id: req.params.id }, 
        { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }} /* l'opérateur $inc incrémente un champ d'une valeur spécifiée */
    )
    .then(() => res.status(200).json({ message: 'Vous avez disliké la sauce ! :(' }))
    .catch((error) => res.status(400).json({ error }));
    }
    })
  }
};
