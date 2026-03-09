const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Book-My-Ticket')
  .then(() => {
    console.log('Mongoose Connected.....');
  })
  .catch((e) => {
    console.log(e);
  });

module.exports = mongoose;
