const express = require('express');
const router = express.Router();

// Placeholder routes for admin
router.get('/', (req, res) => {
  res.json({ message: 'Admin endpoint' });
});

module.exports = router;