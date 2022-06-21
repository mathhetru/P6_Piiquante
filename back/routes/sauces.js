const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const saucesCtrl = require("../controllers/sauces");
const multer = require("../middleware/multer-config");

router.get("/sauces", auth, saucesCtrl.getAllStuff);
router.get("/sauces/:id", auth, saucesCtrl.getOneThing);
router.post("/sauces", auth, multer, saucesCtrl.createThing);
router.put("/sauces/:id", auth, multer, saucesCtrl.modifyThing);
router.delete("/sauces/:id", auth, saucesCtrl.deleteThing);
router.post("/auth/signup", auth, multer, saucesCtrl.createThing);
router.post("/auth/login", auth, multer, saucesCtrl.createThing);
router.post("/sauces/:id/like", auth, multer, saucesCtrl.createThing);

module.exports = router;
