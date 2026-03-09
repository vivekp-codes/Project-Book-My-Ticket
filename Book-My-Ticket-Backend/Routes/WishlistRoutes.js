const express = require("express");
const router = express.Router();
const CheckToken = require("../DataBase/MiddleWare/CheckToken");
const Event = require("../DataBase/Models/EventSchema");
const Wishlist = require("../DataBase/Models/WishlistSchema");


router.post("/add/:eventId", CheckToken(["USER"]), async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    
    const exists = await Wishlist.findOne({
      user: req.user.id,
      event: eventId,
    });
    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      event: eventId,
    });

    res.json({ message: "Added to wishlist", wishlistItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/remove/:eventId", CheckToken(["USER"]), async (req, res) => {
  try {
    const { eventId } = req.params;
    await Wishlist.deleteOne({ user: req.user.id, event: eventId });
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/", CheckToken(["USER"]), async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user.id })
      .populate("event")
      .sort({ createdAt: -1 });
    res.json(wishlistItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;