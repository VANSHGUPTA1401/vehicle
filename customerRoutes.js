const express = require('express');
const Customer = require('../models/customer');
const router = express.Router();

// 1. Create a new customer
router.post('/', async (req, res) => {
  const { name, licenseNumber, address, phone, email } = req.body;

  try {
    // Check if customer already exists based on email or license number
    const existingCustomer = await Customer.findOne({ $or: [{ email }, { licenseNumber }] });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email or license number already exists.' });
    }

    // Create a new customer
    const newCustomer = new Customer({
      name,
      licenseNumber,
      address,
      phone,
      email
    });

    await newCustomer.save();
    res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
  } catch (err) {
    res.status(500).json({ message: 'Error creating customer', error: err.message });
  }
});

// 2. Get all customers (for admin to view all customers)
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err.message });
  }
});

// 3. Get a specific customer by ID (for admin or user to view details)
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer', error: err.message });
  }
});

// 4. Update customer details (e.g., when a user updates their information)
router.put('/:id', async (req, res) => {
  const { name, licenseNumber, address, phone, email } = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, licenseNumber, address, phone, email },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (err) {
    res.status(500).json({ message: 'Error updating customer', error: err.message });
  }
});

// 5. Delete a customer (e.g., when a customer deletes their account)
router.delete('/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting customer', error: err.message });
  }
});

module.exports = router;
//CODE FOR customerRoutes.js