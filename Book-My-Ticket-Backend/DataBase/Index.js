const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongooseAltas Connected.....");
  })
  .catch((e) => {
    console.log(e);
  });

module.exports = mongoose;