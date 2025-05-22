// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Customer = require('../models/customerModel');
const { validationResult } = require('express-validator');

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password, fullName, phone, address, role = 'customer' } = req.body;

    // Check if user exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userId = await User.create({
      username,
      passwordHash,
      email,
      role,
      fullName,
      phone
    });

    // If customer, create customer record
    if (role === 'customer') {
      await Customer.create(userId, address);
    }

    // Generate token
    const token = generateToken(userId, role);

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { userId, username, email, role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.user_id, user.role);

    res.json({ 
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      phone: user.phone
    };

    if (user.role === 'customer') {
      const customer = await Customer.findByUserId(user.user_id);
      profile = { ...profile, address: customer.address, loyaltyPoints: customer.loyalty_points };
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};