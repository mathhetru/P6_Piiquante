const express = require('express'); /* constante qui appelle express */
const router = express.Router(); /* utilisation de la classe express.Router pour créer des gestionnaires de routes modulaires et pouvant être montés */

const userCtrl = require('../controllers/user'); /* constante qui appelle le fichier user dans le dossier controllers */

router.post('/signup', userCtrl.signup); /* route qui appelle en méthode POST le middleware "signup" du fichier user dans dossier controllers et l'envoie sur /signup */
router.post('/login', userCtrl.login); /* route qui appelle en méthode POST le middleware "login" du fichier user dans dossier controllers et l'envoie sur /signup */

module.exports = router; /* export des routes */ 