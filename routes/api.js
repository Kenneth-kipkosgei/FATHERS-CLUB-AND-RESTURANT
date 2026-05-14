const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const dataFile = path.join(__dirname, '..', 'data', 'reservations.json');

// Helper to read reservations
function readReservations() {
  try {
    if (!fs.existsSync(dataFile)) return [];
    const raw = fs.readFileSync(dataFile, 'utf8');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Helper to write reservations
function writeReservations(arr) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(arr, null, 2), 'utf8');
}

// GET /api/reservations - list reservations (admin/demo)
router.get('/reservations', (req, res) => {
  const arr = readReservations();
  res.json(arr);
});

// POST /api/reservations - create a reservation
router.post('/reservations', (req, res) => {
  const { name, phone, date, time, guests, notes } = req.body;
  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const arr = readReservations();
  const reservation = {
    id: Date.now(),
    name,
    phone,
    date,
    time,
    guests: Number(guests),
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };
  arr.push(reservation);
  try {
    writeReservations(arr);
    res.json({ ok: true, reservation });
  } catch (e) {
    res.status(500).json({ error: 'Could not save reservation' });
  }
});

module.exports = router;
