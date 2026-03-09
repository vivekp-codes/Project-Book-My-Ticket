const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Booking = require("../DataBase/Models/BookingSchema");
const Event = require("../DataBase/Models/EventSchema");
const CheckToken = require("../DataBase/MiddleWare/CheckToken");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", CheckToken(["USER"]), async (req, res) => {
  try {
    const { eventId, quantity, selectedSeats } = req.body;

    
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: event.title },
            unit_amount: event.price * 100, 
          },
          quantity,
        },
      ],
      metadata: {
        eventId: event._id.toString(),
        quantity: quantity.toString(),
        seats: JSON.stringify(selectedSeats || []),
        userId: req.user.id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ url: session.url });

  } catch (err) {
    console.log("Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get(
  "/by-session/:sessionId",
  CheckToken(["USER"]),
  async (req, res) => {
    try {
      const { sessionId } = req.params;

      
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (!session || !session.payment_intent) {
        return res.status(404).json({ message: "Session not found" });
      }

      
      const booking = await Booking.findOne({
        paymentId: session.payment_intent,
      })
        .populate("event")
        .populate("user");

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(booking);

    } catch (error) {
      console.log("Fetch booking error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.get(
  "/my-bookings",
  CheckToken(["USER"]),
  async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user.id })
        .populate("event")
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (error) {
      console.log("Fetch my bookings error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.get(
  "/admin/user-bookings/:userId",
  CheckToken(["ADMIN"]),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const bookings = await Booking.find({ user: userId })
        .populate("event")
        .populate("user")
        .sort({ createdAt: -1 });

      res.json(bookings);

    } catch (error) {
      console.log("Admin fetch user bookings error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.get(
  "/admin/top-users",
  CheckToken(["ADMIN"]),
  async (req, res) => {
    try {

      const topUsers = await Booking.aggregate([

        
        { $match: { status: "BOOKED" } },

       
        {
          $group: {
            _id: "$user",
            totalTickets: { $sum: "$quantity" },
            totalAmount: { $sum: "$totalAmount" }
          }
        },

        
        { $sort: { totalAmount: -1, totalTickets: -1 } },

        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },

        
        { $unwind: "$user" },

        
        { $limit: 3 }

      ]);

      res.json(topUsers);

    } catch (error) {
      console.log("Fetch top users error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.get(
  "/admin/top-events",
  CheckToken(["ADMIN"]),
  async (req, res) => {
    try {

      const topEvents = await Booking.aggregate([

        
        { $match: { status: "BOOKED" } },

        
        {
          $group: {
            _id: "$event",
            soldTickets: { $sum: "$quantity" }
          }
        },

       
        { $sort: { soldTickets: -1 } },

        
        {
          $lookup: {
            from: "events",
            localField: "_id",
            foreignField: "_id",
            as: "event"
          }
        },

        
        { $unwind: "$event" },

        { $limit: 3 },

      
        {
          $project: {
            _id: 0,
            eventId: "$event._id",
            title: "$event.title",
            image: "$event.image",
            totalTickets: "$event.totalTickets",  
            soldTickets: 1,
            balanceTickets: {
              $subtract: ["$event.totalTickets", "$soldTickets"]
            }
          }
        }

      ]);

      res.json(topEvents);

    } catch (error) {
      console.log("Fetch top events error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
