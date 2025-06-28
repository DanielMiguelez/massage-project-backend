const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  masajistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, index: true }, // Día específico
  timeSlots: [
    {
      startTime: { type: String, required: true }, // Ej: "09:00"
      endTime: { type: String, required: true },   // Ej: "10:00"
      isAvailable: { type: Boolean, default: true },
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }
    }
  ],
  isBlocked: { type: Boolean, default: false }, // Para bloquear el día completo
  notes: String
}, { timestamps: true });
 
module.exports = mongoose.model('Schedule', ScheduleSchema);
