const express = require('express');
const Maintenance = require('../models/maintenance');
const Vehicle = require('../models/vehicle');
const router = express.Router();

// 1. Schedule a new maintenance task for a vehicle
router.post('/', async (req, res) => {
  const { vehicle_id, maintenanceType, maintenanceDate, description, costEstimate } = req.body;

  try {
    // Check if the vehicle exists
    const vehicle = await Vehicle.findById(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Create a new maintenance task
    const newMaintenance = new Maintenance({
      vehicle_id,
      maintenanceType,
      maintenanceDate,
      description,
      costEstimate,
      status: 'Scheduled',  // Initial status when a task is created
    });

    // Save the maintenance task
    await newMaintenance.save();

    // Update the vehicle's maintenance status
    vehicle.isUnderMaintenance = true; // Set the vehicle as being under maintenance
    await vehicle.save();

    res.status(201).json({ message: 'Maintenance scheduled successfully', maintenance: newMaintenance });
  } catch (err) {
    res.status(500).json({ message: 'Error scheduling maintenance', error: err.message });
  }
});

// 2. Get all maintenance tasks for a specific vehicle
router.get('/:vehicle_id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const maintenances = await Maintenance.find({ vehicle_id: req.params.vehicle_id });
    res.status(200).json(maintenances);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching maintenance tasks', error: err.message });
  }
});

// 3. Get all maintenance tasks (for admin to view all ongoing/ completed maintenance)
router.get('/', async (req, res) => {
  try {
    const maintenances = await Maintenance.find();
    res.status(200).json(maintenances);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching maintenance tasks', error: err.message });
  }
});

// 4. Update maintenance status (e.g., when maintenance is completed)
router.put('/:id', async (req, res) => {
  const { status, description, costEstimate } = req.body;

  try {
    const maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    // Update maintenance task
    maintenance.status = status || maintenance.status;
    maintenance.description = description || maintenance.description;
    maintenance.costEstimate = costEstimate || maintenance.costEstimate;

    await maintenance.save();

    // If maintenance is completed, update vehicle status
    if (status === 'Completed') {
      const vehicle = await Vehicle.findById(maintenance.vehicle_id);
      if (vehicle) {
        vehicle.isUnderMaintenance = false; // Mark the vehicle as available again
        await vehicle.save();
      }
    }

    res.status(200).json({ message: 'Maintenance task updated successfully', maintenance });
  } catch (err) {
    res.status(500).json({ message: 'Error updating maintenance task', error: err.message });
  }
});

// 5. Delete a maintenance record (e.g., if canceled or deleted)
router.delete('/:id', async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    // If maintenance was deleted, update the vehicle's status
    const vehicle = await Vehicle.findById(maintenance.vehicle_id);
    if (vehicle) {
      vehicle.isUnderMaintenance = false; // Mark vehicle as available again
      await vehicle.save();
    }

    res.status(200).json({ message: 'Maintenance task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting maintenance task', error: err.message });
  }
});

module.exports = router;
//CODE FOR maintenance.js