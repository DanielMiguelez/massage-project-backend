const express = require("express");
const router = express.Router();

const MassageController = require("../controllers/MassageController")

router.post("/createMassage", MassageController.createMassage)

module.exports = router;