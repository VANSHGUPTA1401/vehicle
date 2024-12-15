const express = require('express');
const Booking = require('../models/booking');
const Vehicle = require('../models/vehicle');
const router = express.Router();

// Create a booking
router.post('/', async (req, res) => {
  const { customer_id, vehicle_id, rentalDuration, startDate, endDate } = req.body;

  try {
    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle || !vehicle.availability) {
      return res.status(400).json({ message: 'Vehicle not available' });
    }

    const totalCost = vehicle.price * rentalDuration;
    const newBooking = new Booking({
      customer: customer_id,
      vehicle: vehicle_id,
      rentalDuration,
      totalCost,
      startDate,
      endDate,
    });

    vehicle.availability = false;
    await vehicle.save();
    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
});

module.exports = router;
//CODE FOR bookingRoutes.js