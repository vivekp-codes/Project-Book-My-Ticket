// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const DB = require('./DataBase');

// const userRoutes = require('./Routes/UserRoutes');
// const imageRoutes = require('./Routes/ImageRoutes');
// const eventRoutes = require('./Routes/EventRoutes');
// const dashboardRoutes = require("./Routes/DashboardRoutes"); 
// const bookingRoutes = require('./Routes/BookingRoutes');
// const webhookRoutes = require('./Routes/WebhookRoutes');
// const wishlistRoutes = require('./Routes/WishlistRoutes');







// const app = express();

// app.use(cors());

// app.use(
//   "/api/webhook",
//   express.raw({ type: "application/json" }),
//   webhookRoutes
// );

// app.use(express.json());





// app.use('/api/user', userRoutes);
// app.use('/api/image', imageRoutes);
// app.use("/api/events", eventRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/wishlist", wishlistRoutes);





// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const DB = require('./DataBase');

const userRoutes = require('./Routes/UserRoutes');
const imageRoutes = require('./Routes/ImageRoutes');
const eventRoutes = require('./Routes/EventRoutes');
const dashboardRoutes = require("./Routes/DashboardRoutes"); 
const bookingRoutes = require('./Routes/BookingRoutes');
const webhookRoutes = require('./Routes/WebhookRoutes');
const wishlistRoutes = require('./Routes/WishlistRoutes');

const app = express();

app.use(cors());

app.use(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

app.use(express.json());

/* ROUTES */
app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});