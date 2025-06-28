const Schedule = require("../models/Schedule");

const ScheduleController = {
    async createOrUpdateSchedule(req, res) {
        try {
            const { date, timeSlots, isBlocked, notes } = req.body;
            const masajistaId = req.user._id; // ID del usuario autenticado

            const scheduleDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (scheduleDate < today) {
                return res.status(400).send({ 
                    msg: "Cannot create schedule for past dates" 
                });
            }

            let schedule = await Schedule.findOne({ 
                date: scheduleDate,
                masajistaId: masajistaId
            });

            if (schedule) {
                schedule.timeSlots = timeSlots || schedule.timeSlots;
                schedule.isBlocked = isBlocked !== undefined ? isBlocked : schedule.isBlocked;
                schedule.notes = notes || schedule.notes;
                await schedule.save();
            } else {
                schedule = await Schedule.create({
                    masajistaId: masajistaId,
                    date: scheduleDate,
                    timeSlots: timeSlots || [],
                    isBlocked: isBlocked || false,
                    notes
                });
            }

            res.status(201).send({ 
                msg: "Schedule created/updated successfully", 
                schedule 
            });
        } catch (error) {
            console.log("Error creating/updating schedule:", error);
            res.status(500).send({ 
                msg: "Error creating/updating schedule", 
                error: error.message 
            });
        }
    }
};

module.exports = ScheduleController;