const express = require('express');
const router = express.Router();
const db = require('../db/db-access');

// Route to get all exercises
router.get('/', (req, res) => {
  const query = 'SELECT * FROM exercises';

  //loging get time
  const formattedDateTime = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
  console.log('Selecting all exercises: ' + formattedDateTime)

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
      return;
    }

    res.status(200).json({ exercises: rows });
  });
});

// Route to create a new exercise
router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Exercise name is required' });
    return;
  }

  const query = 'INSERT INTO exercises (name) VALUES (?)';

  db.run(query, [name], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
      return;
    }

  //loging post time
  const formattedDateTime = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
  console.log('Creating exercise ' + name + ' :' + formattedDateTime)
    res.status(201).json({
      message: 'Exercise created successfully',
    });
  });
});

module.exports = router;
