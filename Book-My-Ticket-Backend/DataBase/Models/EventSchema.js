const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: String,
  isBooked: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    category: {
      type: String,
      enum: ["Concert", "Workshop", "Race", "Seminar", "Festival"],
      required: true
    },

    venue: { type: String, required: true },
    city: { type: String, required: true },

    date: { type: Date, required: true },
    time: { type: String, required: true },

    price: { type: Number, required: true },
    image: { type: String, required: true },

    seatArrangement: { type: Boolean, default: false },
    layoutType: { type: String, enum: ["grid", "round"], default: null },

    totalTickets: { type: Number, default: 0 },
    soldTickets: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active"
    },

    seats: [seatSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
