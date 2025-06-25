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
    }
}

module.exports = UserController;