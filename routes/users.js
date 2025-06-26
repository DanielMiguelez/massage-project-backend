const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController")

router.post("/createUser", UserController.createUser)
router.get("/getAllUsers", UserController.getAllUsers)
router.get("/getUserById/:_id", UserController.getUserById)
router.delete("/deleteUserById/:_id", UserController.deleteUserById)
router.put("/updateUserById/:_id", UserController.updateUserById)
router.post("/login", UserController.login);

module.exports = router;