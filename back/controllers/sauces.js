const Sauce = require("../models/Sauces");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //récupère les informations du formulaire
  delete sauceObject._id; //supprimer le faux id envoyé par le front
  const sauce = new Sauce({
    ...sauceObject, // Le spread ... est utilisé pour faire une copie de tous les éléments de sauceObject 
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // on ajoute l'image
    likes:0, // on ajoute le like
    dislikes:0 // on ajoute le dislike
  });
  sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  var sauceObject = {};
  if (req.file) {
    sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        };
  } else {
    sauceObject = { ...req.body };
  }
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
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
      if (sauce.usersLiked.includes(req.body.userId)){ //si l'userId est présent dans les usersLiked alors
          Sauce.updateOne( //on modifie celui dont l'ID est égal à l'ID envoyé dans les paramètres de requêtes en mettant un like a -1 et en enlevant userId des usersLiked
          { _id: req.params.id }, 
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }}
      )
      .then(() => res.status(200).json({ message: 'Vous avez disliké la sauce ! :(' }))
      .catch((error) => res.status(400).json({ error }));
      } 
      else if (sauce.usersDisliked.includes(req.body.userId)){ //si l'userId est présent dans les usersDisliked alors
        Sauce.updateOne( //on modifie celui dont l'ID est égal à l'ID envoyé dans les paramètres de requêtes en mettant un dislike a -1 et en enlevant userId des usersDisliked
        { _id: req.params.id }, 
        { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }} //L'opérateur $inc incrémente un champ d'une valeur spécifiée
    )
    .then(() => res.status(200).json({ message: 'Vous avez disliké la sauce ! :(' }))
    .catch((error) => res.status(400).json({ error }));
    }
    })
  }
};
