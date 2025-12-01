const express = require("express");
const router = express.Router();
const candidatureController = require("../controller/candidatureController");

router.get("/", candidatureController.getCandidatures);
router.post("/", candidatureController.addCandidature);
router.get("/count", candidatureController.countCandidatures);


module.exports = router;