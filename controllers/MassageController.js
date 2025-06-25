const Massage = require("../models/Massage")
const User = require("../models/User")

const MassageController = {
    async createMassage(req, res) {
        try {
            const massage = await Massage.create({ ...req.body});
            res.status(201).send({ msg: "Massage created Successfully ! ", massage })
        } catch(error) {
            console.log("Not able to create massage:", error);
            res.status(500).send({ msg: "Error creating massage", error });
        }
    },
}

module.exports = MassageController;