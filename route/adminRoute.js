const adminController = require("../controller/adminController");
const express = require("express");
const router = express.Router();

router.post("/", adminController.adminLogin);
router.post("/create", adminController.createAdmin);

module.exports = router;