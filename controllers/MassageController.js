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

    async getAllMassages(req, res){
        try {
            const massages = await Massage.find();

            if(!massages){
                res.status(400).send({msg:"There are no massages", massages})
            }

            res.status(200).send({msg:"Here are all the massages", massages})
        } catch (error) {
            console.log("Not able to get massages:", error);
            res.status(500).send({ msg: "Error getting massages", error });
        }
    },
    async getMassageById(req, res){
        try {
            const MassageById = await Massage.findById(req.params._id);
            res.status(201).send({msg:"Massage by the ID you selected" , MassageById})
        } catch (error) {
            console.log("Not able to bring the massage:", error);
        }
    },

    async deleteMassageById(req, res){
        try {
            const massageToDelete = await Massage.findByIdAndDelete(req.params._id);

            if (!massageToDelete) {
                return res.status(400).send("your massage does not exist")
            }

            res.status(200).send({ msg: "massage deleted", id: req.params._id })
        } catch (error) {
            console.log("Not able to bring massage:", error);
        }
    },

    async updateMassageById(req, res){
        try{
            const massageToUpdate = await Massage.findByIdAndUpdate(req.params._id, req.body, { new: true });

            if(!massageToUpdate){
                return res.status(400).send("There is no massage to update")
            }
            res.status(200).send({ msg: "Your massage updated", massage: massageToUpdate });
        }catch(error){
            console.log("Not able to update massage:", error);
        }
    }
}

module.exports = MassageController;