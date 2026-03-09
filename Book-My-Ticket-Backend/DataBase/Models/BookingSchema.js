const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    selectedSeats: [
      {
        type: String
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentId: {                 
      type: String,
      required: true,
      unique: true               
    },

    status: {
      type: String,
      enum: ["BOOKED", "CANCELLED"],
      default: "BOOKED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);