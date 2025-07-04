const Massage = require("../models/Massage")
const User = require("../models/User")
const Order = require("../models/Order")
const PaymentController = require("./PaymentController")

const OrderController = {
    async createOrder(req, res) {
        try {
            const { userId, guestName, guestEmail, guestPhone, massageId, scheduledDate, locationType, address, totalPrice } = req.body;

            const massage = await Massage.findById(massageId);
            if (!massage) {
                return res.status(404).send({ msg: "Massage not found" });
            }

            if (userId) {
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).send({ msg: "User not found" });
                }
            } else {
                if (!guestName || !guestEmail || !guestPhone) {
                    return res.status(400).send({ msg: "Guest name, email, and phone are required for guest orders" });
                }
            }

            const order = await Order.create({
                userId: userId || undefined,
                guestName: userId ? undefined : guestName,
                guestEmail: userId ? undefined : guestEmail,
                guestPhone: userId ? undefined : guestPhone,
                massageId,
                scheduledDate,
                locationType,
                address,
                totalPrice
            });

            res.status(201).send({ msg: "Order created successfully", order });
        } catch (error) {
            console.log("Not able to create order:", error);
            res.status(500).send({ msg: "Error creating order", error });
        }
    },

    async getAllOrders(req, res) {
        try {
            const orders = await Order.find();
            res.status(200).send({ msg: "All orders", orders });
        } catch (error) {
            console.log("Not able to get all orders:", error);
            res.status(500).send({ msg: "Error getting all orders", error });
        }
    },

    async getOrderById(req, res) {
        try {
            const order = await Order.findById(req.params._id);

            if (!order) {
                return res.status(404).send({ msg: "Order not found" });
            }

            res.status(200).send({ msg: "Order found", order });
        } catch (error) {
            console.log("Not able to get order by id:", error);
            res.status(500).send({ msg: "Error getting order by id", error });
        }
    },

    async updateOrderById(req, res) {
        try {
            const order = await Order.findByIdAndUpdate(req.params._id, req.body, { new: true });
            res.status(200).send({ msg: "Order updated", order });
        } catch (error) {
            console.log("Not able to update order by id:", error);
        }
    },

    async deleteOrderById(req, res) {
        try {
            const order = await Order.findByIdAndDelete(req.params._id);
            res.status(200).send({ msg: "Order deleted", order });
        } catch (error) {
            console.log("Not able to delete order by id:", error);
        }
    },

    async getOrdersByUser(req, res) {
        try {
            if (req.user._id.toString() !== req.params.userId) {
                return res.status(403).send({ msg: "You are not authorized to view these orders" });
            }
            const orders = await Order.find({ userId: req.params.userId });
            res.status(200).send({ msg: "Orders", orders });
        } catch (error) {
            console.log("Not able to see orders:", error);
            res.status(500).send({ msg: "Error getting user's orders", error });        }

    },

    async getOrdersByGuest(req, res) {
        try {
            const { email, phone } = req.query;
            if (!email && !phone) {
                return res.status(400).send({ msg: "Email or phone required" });
            }
            const query = {};
            if (email) query.guestEmail = email;
            if (phone) query.guestPhone = phone;

            const orders = await Order.find(query);
            res.status(200).send({ msg: "Guest orders", orders });
        } catch (error) {
            console.log("Not able to get guest orders:", error);
            res.status(500).send({ msg: "Error getting guest orders", error });
        }
    },

    async getMyOrders(req, res) {
        try {
            const orders = await Order.find({ userId: req.user._id });
            res.status(200).send({ msg: "Your orders", orders });
        } catch (error) {
            console.log("Not able to get your orders:", error);
            res.status(500).send({ msg: "Error getting your orders", error });
        }
    },

    async cancelOrder(req, res) {
        return PaymentController.cancelOrder(req, res);
    }
};

module.exports = OrderController;