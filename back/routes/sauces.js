const express = require("express"); /* constante qui appelle express */
const auth = require("../middleware/auth"); /* import du fichier auth dans dossier middleware afin de vérifier les tokens des utilisateurs sur nos routes */
const router = express.Router(); /* utilisation de la classe express.Router pour créer des gestionnaires de routes modulaires et pouvant être montés */

const saucesCtrl = require("../controllers/sauces"); /* appelle du fichier sauce dans le dossier controllers */
const multer = require("../middleware/multer-config"); /* appelle du fichier multer-config dans le dossier middleware */

router.post("/sauces", auth, multer, saucesCtrl.createSauce); /* route en POST, appelle le middleware "createSauce" du fichier sauce dans controllers avec AVANT un middleware d'auth et multer */
router.get("/sauces/:id", auth, saucesCtrl.getOneSauce); /* route en GET, appelle le middleware "getOneSauce" du fichier sauce dans controllers avec AVANT un middleware d'auth */
router.get("/sauces", auth, saucesCtrl.getAllSauce); /* route en GET, appelle le middleware "getAllSauce" du fichier sauce dans controllers avec AVANT un middleware d'auth */
router.put("/sauces/:id", auth, multer, saucesCtrl.modifySauce); /* route en PUT, appelle le middleware "modifySauce" du fichier sauce dans controllers avec AVANT un middleware d'auth et multer */
router.delete("/sauces/:id", auth, saucesCtrl.deleteSauce); /* route en DELETE, appelle le middleware "deleteSauce" du fichier sauce dans controllers avec AVANT un middleware d'auth */
router.post("/sauces/:id/like", auth, saucesCtrl.likedSauce); /* route en POST, appelle le middleware "likedSauce" du fichier sauce dans controllers avec AVANT un middleware d'auth */

module.exports = router; /* export des routes */ 
