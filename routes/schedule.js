const express = require("express");
const router = express.Router();

const ScheduleController = require("../controllers/ScheduleController");
const { authentication, isAdmin } = require("../middlewares/authentication");

// Ruta para crear/actualizar horarios (solo admin/masajista)
router.post("/create", authentication, isAdmin, ScheduleController.createOrUpdateSchedule);
router.get("/available", ScheduleController.getAvailableSchedules);
router.post("/check-availability", ScheduleController.checkAvailability);
router.post("/block-day", authentication, isAdmin, ScheduleController.blockDay);
router.post("/unblock-day", authentication, isAdmin, ScheduleController.unblockDay);

module.exports = router; 