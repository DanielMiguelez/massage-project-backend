const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/OrderController");
const { authentication, isAdmin } = require("../middlewares/authentication");

router.post("/createOrder", OrderController.createOrder)
router.get("/getAllOrders", authentication, isAdmin, OrderController.getAllOrders) 
router.get("/getOrderById/:_id", authentication, OrderController.getOrderById) 
router.put("/updateOrderById/:_id", authentication, OrderController.updateOrderById)
router.delete("/deleteOrderById/:_id", authentication, OrderController.deleteOrderById)
router.get("/getOrdersByUser/:userId", authentication, OrderController.getOrdersByUser)
router.get("/getOrdersByGuest", OrderController.getOrdersByGuest);
router.get("/myOrders", authentication, OrderController.getMyOrders);
router.post('/cancelOrder', authentication, OrderController.cancelOrder);

module.exports = router;