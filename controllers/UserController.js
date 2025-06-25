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
    },

    async deleteUserById(req, res){
        try {
            const userToDelete = await User.findByIdAndDelete(req.params._id);

            if (!userToDelete) {
                return res.status(400).send("your user does not exist")
            }

            res.status(200).send({ msg: "user deleted", id: req.params._id })
        } catch (error) {
            console.log("Not able to bring user:", error);
        }
    },

    async updateUserById(req, res){
        try{
            const userToUpdate = await User.findByIdAndUpdate(req.params._id, req.body, { new: true });

            if(!userToUpdate){
                return res.status(400).send("There is no user to update")
            }
            res.status(200).send({ msg: "Your user updated", user: userToUpdate });
        }catch(error){
            console.log("Not able to update user:", error);
        }
    }
}

module.exports = UserController;