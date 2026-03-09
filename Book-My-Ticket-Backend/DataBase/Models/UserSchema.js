const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      default: ''   
    },

    profilePic: {
      type: String,
      default: ''
    },

    address: {
      state: {
        type: String,
        default: ''   
      },
      district: {
        type: String,
        default: ''   
      }
    },

    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
