const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/OrderController");

router.post("/createOrder", OrderController.createOrder)
router.get("/getAllOrders", OrderController.getAllOrders) 
router.get("/getOrderById/:_id", OrderController.getOrderById) 
router.put("/updateOrderById/:_id", OrderController.updateOrderById)
router.delete("/deleteOrderById/:_id", OrderController.deleteOrderById)

module.exports = router;