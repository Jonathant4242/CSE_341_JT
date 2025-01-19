const mongoose = require('mongoose');
const { Timestamp } = require('bson'); // Import Timestamp from bson

// Define the schema for contacts
const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    favoriteColor: String,
    birthday: String,
    phone: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now } // Use bson.Timestamp
});

// Create the model for contacts
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;