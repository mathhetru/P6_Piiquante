const multer = require('multer'); /* package permettant de gérer les fichiers entrants */
const fs = require('fs'); /* package qui fournit des fonctionnalités très utiles pour accéder et interagir avec le système de fichiers */

const MIME_TYPES = { /* dictionnaire des extensions de fichiers entrants */
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

const storage = multer.diskStorage({ /* utilisation de la function diskStorage pour dire que l'on va enregistrer sur le disque */
    destination: (req, file, callback) => { /* function qui a besoin de 2 elements : destination et filename */
        if (!fs.existsSync('images')) { /* si le dossier images n'existe pas */
            fs.mkdirSync('images'); /* créé un dossier images */ 
            callback(null, 'images'); /* le callback enregistre l'image sur images */
        } else { /* sinon si le dossier existe */
        callback(null, 'images'); /* le callback enregistre l'image sur images */
        }
    },
    filename: (req, file, callback) => { /* argument filename qui explique à multer quel nom de fichier utiliser */
        const name = file.originalname.split(' ').join('_'); /* genere le nouveau nom avec une séparation du nom original et qui les remplace par le _ en les join en 1 seul string */
        const extension = MIME_TYPES[file.mimetype]; /* créer l'extension du fichier qui correspond au mimetype du fichier envoyé */
        callback(null, name + Date.now() + '.' + extension);  /* on appelle le callback avec le name du fichier auquel on ajoute le temps, puis un . et l'extension */
    } /* gènere un nom de fichier suffisamment unique pour l'utilisation */
});

module.exports = multer({ storage }).single('image'); /* export la méthode multer à laquelle on passe notre objet storage avec la méthode single (unique) avec 'image' pour expliquer qu'il s'agit de fichiers image uniquement */