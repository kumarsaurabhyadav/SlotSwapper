const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }

    const existing = await db.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id,name,email',
      [name.trim(), email.toLowerCase().trim(), hashedPassword]
    );
    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ message: 'Signup successful', user, token });
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await db.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    
    // Check if user has password
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Account not set up. Please contact support.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ message: 'Login successful', user, token });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Forgot Password - Send reset token
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await db.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      // Don't reveal if email exists (security best practice)
      return res.json({ message: 'If email exists, reset link has been sent' });
    }

    const user = result.rows[0];
    
    // Check if user has password
    if (!user.password_hash) {
      return res.status(400).json({ error: 'This account does not have a password set.' });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await db.query(
      'UPDATE users SET reset_token=$1, reset_token_expiry=$2 WHERE id=$3',
      [resetToken, resetTokenExpiry, user.id]
    );

    // In production, send email here with reset link
    // For development/testing, return token
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    if (process.env.NODE_ENV !== 'production') {
      // Development mode - log token for testing
      console.log(`Password reset token for ${email}: ${resetToken}`);
      console.log(`Reset link: ${resetLink}`);
      res.json({ 
        message: 'If email exists, reset link has been sent',
        resetToken: resetToken, // Only in development
        resetLink: resetLink
      });
    } else {
      // Production mode - send email (implement email service here)
      // TODO: Integrate email service (SendGrid, Nodemailer, etc.)
      // For now, just return success message
      res.json({ 
        message: 'If email exists, reset link has been sent to your email'
      });
    }
  } catch (err) {
    console.error('Forgot Password Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Reset Password - Verify token and update password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE reset_token=$1 AND reset_token_expiry > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = result.rows[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      'UPDATE users SET password_hash=$1, reset_token=NULL, reset_token_expiry=NULL WHERE id=$2',
      [hashedPassword, user.id]
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ this line is mandatory!
module.exports = router;