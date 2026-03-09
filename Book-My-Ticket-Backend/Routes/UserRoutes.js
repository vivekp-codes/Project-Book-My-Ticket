const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../DataBase/Models/UserSchema');
const CheckToken = require('../DataBase/MiddleWare/CheckToken');

const router = express.Router();

const SECRET_KEY =
  'vhhdhejbfajbafjvafvfvavvvasvvdduwhuhwue6734483748723dhdschsdbhbhvsds8u3847';



router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});




router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    let user;
    let isAdmin = false;

    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      user = {
        _id: 'ADMIN_ID', 
        username: 'Admin',
        email: process.env.ADMIN_EMAIL,
        role: 'ADMIN',
        profilePic: '',
        address: {}
      };
      isAdmin = true;
    } else {
      
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});



router.patch(
  '/profile',
  CheckToken(['USER', 'ADMIN']),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { username, phone, address, profilePic, password } = req.body;

      const updateData = {};

      if (username !== undefined) updateData.username = username;
      if (phone !== undefined) updateData.phone = phone;
      if (profilePic !== undefined) updateData.profilePic = profilePic;

      if (address !== undefined) {
        const existingUser = await User.findById(userId);

        updateData.address = {
          state: address.state ?? existingUser.address.state,
          district: address.district ?? existingUser.address.district
        };
      }


      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      res.status(200).json({
        message: 'Profile updated',
        user: updatedUser
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);




router.get(
  "/all-users",
  CheckToken(["ADMIN"]), 
  async (req, res) => {
    try {
      const users = await User.find({ role: { $ne: "ADMIN" } })
        .select("-password")   
        .sort({ createdAt: -1 }); 

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch users"
      });
    }
  }
);




router.patch('/reset-password', async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});



module.exports = router;
