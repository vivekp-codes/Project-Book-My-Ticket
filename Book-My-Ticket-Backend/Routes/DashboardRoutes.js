const express = require("express");
const router = express.Router();
const Event = require("../DataBase/Models/EventSchema");
const User = require("../DataBase/Models/UserSchema");
const Booking = require("../DataBase/Models/BookingSchema");

router.get("/stats", async (req, res) => {
  try {
    const now = new Date();

    const year = parseInt(req.query.year) || now.getFullYear();
    const month = req.query.month !== undefined
      ? parseInt(req.query.month)
      : now.getMonth(); 

    const week = req.query.week ? parseInt(req.query.week) : null;

    

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    let weekStart, weekEnd;

    if (week) {
      weekStart = new Date(year, month, (week - 1) * 7 + 1);
      weekEnd = new Date(year, month, Math.min(week * 7, new Date(year, month + 1, 0).getDate()), 23, 59, 59);
    }

    

    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();

    const totalTicketsData = await Event.aggregate([
      {
        $group: {
          _id: null,
          totalTickets: { $sum: "$totalTickets" }
        }
      }
    ]);

    const bookingData = await Booking.aggregate([
      { $match: { status: "BOOKED" } },
      {
        $group: {
          _id: null,
          actualRevenue: { $sum: "$totalAmount" },
          totalSoldTickets: { $sum: "$quantity" },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

  

    const monthMatch = {
      status: "BOOKED",
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
    };

    const monthData = await Booking.aggregate([
      { $match: monthMatch },
      {
        $group: {
          _id: null,
          monthRevenue: { $sum: "$totalAmount" },
          monthTickets: { $sum: "$quantity" }
        }
      }
    ]);

   

    let prevYear = year;
    let prevMonth = month - 1;

    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear = year - 1;
    }

    const prevMonthStart = new Date(prevYear, prevMonth, 1);
    const prevMonthEnd = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59);

    const lastMonthData = await Booking.aggregate([
      {
        $match: {
          status: "BOOKED",
          createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd }
        }
      },
      {
        $group: {
          _id: null,
          lastMonthRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    

    let weekRevenue = 0;
    let weekTickets = 0;
    let lastWeekRevenue = 0;

    if (week) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      weekStart = new Date(year, month, (week - 1) * 7 + 1);
      weekEnd = new Date(
        year,
        month,
        Math.min(week * 7, daysInMonth),
        23, 59, 59
      );

      const currentWeekData = await Booking.aggregate([
        {
          $match: {
            status: "BOOKED",
            createdAt: { $gte: weekStart, $lte: weekEnd }
          }
        },
        {
          $group: {
            _id: null,
            weekRevenue: { $sum: "$totalAmount" },
            weekTickets: { $sum: "$quantity" }
          }
        }
      ]);

      weekRevenue = currentWeekData[0]?.weekRevenue || 0;
      weekTickets = currentWeekData[0]?.weekTickets || 0;

      

      const prevWeekStart = new Date(year, month, (week - 2) * 7 + 1);
      const prevWeekEnd = new Date(
        year,
        month,
        (week - 1) * 7,
        23, 59, 59
      );

      if (week > 1) {
        const prevWeekData = await Booking.aggregate([
          {
            $match: {
              status: "BOOKED",
              createdAt: { $gte: prevWeekStart, $lte: prevWeekEnd }
            }
          },
          {
            $group: {
              _id: null,
              lastWeekRevenue: { $sum: "$totalAmount" }
            }
          }
        ]);

        lastWeekRevenue = prevWeekData[0]?.lastWeekRevenue || 0;
      }
    }

  

    const monthlyChart = await Booking.aggregate([
      {
        $match: {
          status: "BOOKED",
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formattedMonthlyChart = Array.from({ length: 12 }).map((_, i) => {
      const found = monthlyChart.find(m => m._id === i + 1);
      return {
        month: new Date(0, i).toLocaleString("default", { month: "short" }),
        revenue: found ? found.revenue : 0
      };
    });



    const dailyChart = await Booking.aggregate([
      {
        $match: {
          status: "BOOKED",
          createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const formattedDailyChart = Array.from({ length: daysInMonth }).map((_, i) => {
      const found = dailyChart.find(d => d._id === i + 1);
      return {
        day: i + 1,
        revenue: found ? found.revenue : 0
      };
    });



    let weeklyDailyChart = [];

    if (week) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const weekStartDate = new Date(year, month, (week - 1) * 7 + 1);
      const weekEndDate = new Date(
        year,
        month,
        Math.min(week * 7, daysInMonth),
        23, 59, 59
      );

      const weekDailyData = await Booking.aggregate([
        {
          $match: {
            status: "BOOKED",
            createdAt: { $gte: weekStartDate, $lte: weekEndDate }
          }
        },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" },
            revenue: { $sum: "$totalAmount" }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      const startDay = (week - 1) * 7 + 1;
      const endDay = Math.min(week * 7, daysInMonth);

      weeklyDailyChart = Array.from(
        { length: endDay - startDay + 1 },
        (_, i) => {
          const dayNumber = startDay + i;
          const found = weekDailyData.find(d => d._id === dayNumber);

          return {
            day: dayNumber,
            revenue: found ? found.revenue : 0
          };
        }
      );
    }

    

    const topEvents = await Booking.aggregate([
      { $match: { status: "BOOKED" } },
      {
        $group: {
          _id: "$event",
          soldTickets: { $sum: "$quantity" }
        }
      },
      { $sort: { soldTickets: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails"
        }
      },
      { $unwind: "$eventDetails" },
      {
        $project: {
          name: "$eventDetails.title",
          image: "$eventDetails.image",
          soldTickets: 1
        }
      }
    ]);

  

    const topUsers = await Booking.aggregate([
      { $match: { status: "BOOKED" } },
      {
        $group: {
          _id: "$user",
          totalTickets: { $sum: "$quantity" }
        }
      },
      { $sort: { totalTickets: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          username: "$userDetails.username",
          email: "$userDetails.email",
          image: "$userDetails.image",
          totalTickets: 1
        }
      }
    ]);

   

    res.json({
      totalEvents,
      totalUsers,
      totalTickets: totalTicketsData[0]?.totalTickets || 0,
      actualRevenue: bookingData[0]?.actualRevenue || 0,
      totalSoldTickets: bookingData[0]?.totalSoldTickets || 0,
      totalBookings: bookingData[0]?.totalBookings || 0,
      monthlyChart: formattedMonthlyChart,
      monthRevenue: monthData[0]?.monthRevenue || 0,
      monthTickets: monthData[0]?.monthTickets || 0,
      lastMonthRevenue: lastMonthData[0]?.lastMonthRevenue || 0,
      dailyChart: formattedDailyChart,
      weeklyDailyChart,
      weekRevenue,
      weekTickets,
      lastWeekRevenue,
      topEvents,
      topUsers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;