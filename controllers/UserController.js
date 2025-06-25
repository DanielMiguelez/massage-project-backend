const User = require("../models/User")
const bcrypt = require("bcryptjs")

const UserController = {

    async createUser(req, res) {
        try {
            const passwordHashed = await bcrypt.hash(req.body.password, 10)
            const user = await User.create({ ...req.body, password: passwordHashed })
            res.status(201).send({ msg: "User created Successfully ! ", user })
        } catch(error) {
            console.log("Not able to create user:", error);
        }
    },

    async getAllUsers(req, res){
        try {
            const users = await User.find();
            res.status(201).send({msg:"Users brought successfully" , users})
        } catch (error) {
            console.log("Not able to bring users:", error);
        }
    },

    async getUserById(req, res){
        try {
            const userById = await User.findById(req.params._id);
            res.status(201).send({msg:"User bythe ID you selected" , userById})
        } catch (error) {
            console.log("Not able to bring user:", error);
        }
    }
}

module.exports = UserController;