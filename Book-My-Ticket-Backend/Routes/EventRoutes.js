const express = require("express");
const router = express.Router();
const Event = require("../DataBase/Models/EventSchema");
const CheckToken = require("../DataBase/MiddleWare/CheckToken");


const allowedCategories = ["Concert", "Workshop", "Race", "Seminar", "Festival"];

router.post("/create", CheckToken(["ADMIN"]), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      city,
      date,
      time,
      price,
      image,
      seatArrangement,
      layoutType,
      rows,
      cols,
      circles,
      seatsPerCircle,
      totalTickets
    } = req.body;

    
    if (!title || !description || !category || !venue || !city || !date || !time || price === undefined) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        message: `Invalid category. Allowed: ${allowedCategories.join(", ")}`
      });
    }

    let seats = [];
    let totalSeats = 0;
    const isSeatEnabled = seatArrangement === true || seatArrangement === "true";

   
    if (isSeatEnabled) {

      
      if (layoutType === "grid") {

        if (!rows || !cols) {
          return res.status(400).json({
            message: "Rows and columns required for grid layout"
          });
        }

        const parsedRows = parseInt(rows);
        const parsedCols = parseInt(cols);

        totalSeats = parsedRows * parsedCols;

        for (let i = 0; i < parsedRows; i++) {
          const rowLetter = String.fromCharCode(65 + i);

          for (let j = 1; j <= parsedCols; j++) {
            seats.push({
              seatNumber: `${rowLetter}${j}`,
              isBooked: false
            });
          }
        }
      }

     
      if (layoutType === "round") {

        if (!circles || !seatsPerCircle) {
          return res.status(400).json({
            message: "Circles and seatsPerCircle required for round layout"
          });
        }

        let seatsArray = [];

        try {
          seatsArray = JSON.parse(seatsPerCircle);
        } catch {
          return res.status(400).json({
            message: "Invalid seatsPerCircle format"
          });
        }

        totalSeats = seatsArray.reduce(
          (sum, num) => sum + parseInt(num),
          0
        );

        for (let c = 1; c <= parseInt(circles); c++) {
          for (let s = 1; s <= parseInt(seatsArray[c - 1]); s++) {
            seats.push({
              seatNumber: `C${c}-${s}`,
              isBooked: false
            });
          }
        }
      }
    }

 
    const event = new Event({
      title,
      description,
      category,
      venue,
      city,
      date,
      time,
      price,
      image: image || null,
      seatArrangement: isSeatEnabled,
      layoutType: isSeatEnabled ? layoutType : null,
      totalTickets: isSeatEnabled
        ? totalSeats
        : parseInt(totalTickets) || 0,
      seats
    });

    await event.save();

    res.status(201).json({
      message: "Event Created Successfully",
      event
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.put("/:id", CheckToken(["ADMIN"]), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const {
      title,
      description,
      category,
      venue,
      city,
      date,
      time,
      price,
      image
    } = req.body;

    
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (category !== undefined) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          message: `Invalid category. Allowed: ${allowedCategories.join(", ")}`
        });
      }
      event.category = category;
    }
    if (venue !== undefined) event.venue = venue;
    if (city !== undefined) event.city = city;
    if (date !== undefined) event.date = date;
    if (time !== undefined) event.time = time;
    if (price !== undefined) event.price = price;
    if (image !== undefined) event.image = image;

    await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      event
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.delete("/:id", CheckToken(["ADMIN"]), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Event deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
