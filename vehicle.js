const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  location: { type: String, required: true },
  carNumber: { type: String, required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  image: { type: String, required: true }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
//CODE FOR vehicle.js