const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController")
const { authentication } = require("../middlewares/authentication")

router.post("/createUser", UserController.createUser)
router.get("/getAllUsers", UserController.getAllUsers)
router.get("/getUserById/:_id", UserController.getUserById)
router.delete("/deleteUserById/:_id", UserController.deleteUserById)
router.put("/updateUserById/:_id", UserController.updateUserById)
router.post("/login", UserController.login);
router.delete("/logout", authentication, UserController.logout);
router.post("/forgotPassword", UserController.forgotPassword);
router.post("/resetPassword", UserController.resetPassword);
router.get("/getProfile", authentication, UserController.getProfile)

module.exports = router; 