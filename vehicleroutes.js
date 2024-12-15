const express = require('express');
const Vehicle = require('../models/vehicle');
const router = express.Router();

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vehicles', error: err.message });
  }
});

// Create a new vehicle
router.post('/', async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(500).json({ message: 'Error creating vehicle', error: err.message });
  }
});

// Update vehicle availability
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Error updating vehicle', error: err.message });
  }
});

module.exports = router;
//CODE FOR vehicleroutes.js