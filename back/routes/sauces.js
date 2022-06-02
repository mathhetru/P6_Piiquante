const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const saucesCtrl = require("../controllers/sauces");
const multer = require("../middleware/multer-config");

router.get("/sauces", auth, saucesCtrl.getAllStuff);
router.post("/auth/signup", auth, multer, saucesCtrl.createThing);
router.post("/auth/login", auth, multer, saucesCtrl.createThing);
router.post("/:id/like", auth, multer, saucesCtrl.createThing);
router.post("/sauces", auth, multer, saucesCtrl.createThing);
router.get("/sauces/:id", auth, saucesCtrl.getOneThing);
router.put("/sauces/:id", auth, multer, saucesCtrl.modifyThing);
router.delete("/sauces/:id", auth, saucesCtrl.deleteThing);

module.exports = router;
