const express = require('express')
const jwt = require('jsonwebtoken')
const { verifyToken } = require('../middleware/auth')

const router = express.Router()

// Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  // Sample mock payload for initial environment setup
  const user = {
    id: 'usr_001',
    name: 'Debraj',
    email,
    role: email.includes('admin') ? 'Super Admin' : 'Developer',
    tenantId: 'tenant_craft_01'
  }

  const token = jwt.sign(
    user,
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '8h' }
  )

  res.status(200).json({
    token,
    user
  })
})

// Get Current Authenticated User profile
router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({ user: req.user })
})

module.exports = router
