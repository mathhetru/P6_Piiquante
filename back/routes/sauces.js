const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const saucesCtrl = require("../controllers/sauces");
const multer = require("../middleware/multer-config");

router.post("/sauces", auth, multer, saucesCtrl.createSauce);
router.get("/sauces/:id", auth, saucesCtrl.getOneSauce);
router.get("/sauces", auth, saucesCtrl.getAllSauce);
router.put("/sauces/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/sauces/:id", auth, saucesCtrl.deleteSauce);

router.post("/sauces/:id/like", auth, multer, saucesCtrl.likedSauce);

module.exports = router;
