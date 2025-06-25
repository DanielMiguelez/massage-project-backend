const express = require("express");
const router = express.Router();

const MassageController = require("../controllers/MassageController")

router.post("/createMassage", MassageController.createMassage)
router.get("/getAllMassages", MassageController.getAllMassages)
router.get("/getMassageById/:_id", MassageController.getMassageById)
router.delete("/deleteMassageById/:_id", MassageController.deleteMassageById)

module.exports = router;