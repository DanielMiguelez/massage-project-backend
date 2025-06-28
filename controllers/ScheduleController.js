const Massage = require("../models/Massage");
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
    },

    async getAvailableSchedules(req, res) {
        try {
            const { startDate, endDate, masajistaId } = req.query;

            let query = {};

            // Filtrar por rango de fechas si se proporcionan
            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            // Filtrar por masajista específico si se proporciona
            if (masajistaId) {
                query.masajistaId = masajistaId;
            }

            const schedules = await Schedule.find(query)
                .populate('masajistaId', 'name email') // Incluir datos del masajista
                .sort({ date: 1 });

            // Filtrar solo los slots disponibles
            const availableSchedules = schedules.map(schedule => {
                const availableSlots = schedule.timeSlots.filter(slot => slot.isAvailable);
                return {
                    ...schedule.toObject(),
                    timeSlots: availableSlots
                };
            }).filter(schedule =>
                schedule.timeSlots.length > 0 && !schedule.isBlocked
            );

            res.status(200).send({
                msg: "Available schedules",
                schedules: availableSchedules
            });
        } catch (error) {
            console.log("Error getting schedules:", error);
            res.status(500).send({
                msg: "Error getting schedules",
                error: error.message
            });
        }
    },

    async checkAvailability(req, res) {
        try {
            const { date, startTime, massageId, masajistaId } = req.body;

            const massage = await Massage.findById(massageId);
            if (!massage) {
                return res.status(404).send({
                    msg: "Massage not found"
                });
            }

            const scheduleDate = new Date(date);
            let query = { date: scheduleDate };
            
            // Si se proporciona masajistaId, filtrar por él
            if (masajistaId) {
                query.masajistaId = masajistaId;
            }

            const schedule = await Schedule.findOne(query);

            if (!schedule || schedule.isBlocked) {
                return res.status(200).send({
                    available: false,
                    msg: "Date is blocked or no schedule available"
                }); 
            }

            const startDateTime = new Date(`${date}T${startTime}`);
            const endDateTime = new Date(startDateTime.getTime() + massage.duration * 60000);
            const endTime = endDateTime.toTimeString().slice(0, 5);

            console.log('Checking availability:', {
                startTime,
                endTime,
                duration: massage.duration,
                scheduleSlots: schedule.timeSlots
            });

            const isAvailable = schedule.isTimeSlotAvailable(startTime, endTime);

            res.status(200).send({
                available: isAvailable,
                startTime,
                endTime,
                duration: massage.duration,
                msg: isAvailable ? "Time slot is available" : "Time slot is not available"
            });

        } catch (error) {
            console.log("Error checking availability:", error);
            res.status(500).send({
                msg: "Error checking availability",
                error: error.message
            });
        }
    }
};

module.exports = ScheduleController;