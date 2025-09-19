const express = require('express');
const router = express.Router();

// Placeholder routes for notifications
router.get('/', (req, res) => {
  res.json({ message: 'Notifications endpoint' });
});

module.exports = router;