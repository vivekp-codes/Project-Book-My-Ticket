const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Booking = require("../DataBase/Models/BookingSchema");
const Event = require("../DataBase/Models/EventSchema");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(" Webhook signature failed.");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      
      const existingBooking = await Booking.findOne({
        paymentId: session.payment_intent,
      });

      if (existingBooking) {
        return res.json({ received: true });
      }

      const eventId = session.metadata.eventId;
      const quantity = parseInt(session.metadata.quantity);
      const selectedSeats = JSON.parse(session.metadata.seats || "[]");
      const userId = session.metadata.userId;

      const eventDoc = await Event.findById(eventId);
      if (!eventDoc) return res.json({ received: true });

      
      if (eventDoc.seatArrangement) {
        for (let seatNumber of selectedSeats) {
          const seat = eventDoc.seats.find(
            (s) => s.seatNumber === seatNumber
          );
          if (seat && !seat.isBooked) {
            seat.isBooked = true;
          }
        }
      }

      eventDoc.soldTickets += quantity;
      await eventDoc.save();

      await Booking.create({
        user: userId,
        event: eventId,
        quantity,
        selectedSeats,
        totalAmount: eventDoc.price * quantity,
        paymentId: session.payment_intent,
        status: "BOOKED",
      });

      console.log(" Booking created via webhook");

    } catch (error) {
      console.log("Webhook DB error:", error);
    }
  }

  res.json({ received: true });
});

module.exports = router;