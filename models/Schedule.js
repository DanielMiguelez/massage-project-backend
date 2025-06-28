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
  isBlocked: { type: Boolean, default: false }, 
  notes: String
}, { timestamps: true });


ScheduleSchema.methods.isTimeSlotAvailable = function(startTime, endTime) {
  const slot = this.timeSlots.find(slot => 
    slot.startTime === startTime && 
    slot.endTime === endTime
  );
  return slot && slot.isAvailable;
};

module.exports = mongoose.model('Schedule', ScheduleSchema);
