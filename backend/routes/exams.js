const express = require('express');
const router = express.Router();

// Placeholder routes for exams
router.get('/', (req, res) => {
  res.json({ message: 'Exams endpoint' });
});

module.exports = router;