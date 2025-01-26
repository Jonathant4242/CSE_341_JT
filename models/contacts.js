const mongoose = require('mongoose');


// Define the schema for contacts
const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    favoriteColor: { type: String, required: false },
    birthday: { type: Date, required: false }, // Changed to Date for consistency
    phone: { type: String, required: false },
    tags: { type: [String], required: false },
    createdAt: { type: Date, default: Date.now }, // Automatically set on creation
    lastModified: { type: Date, default: Date.now } // Automatically update on modification
});

// Middleware to automatically update the `lastModified` field
contactSchema.pre('save', function (next) {
    this.lastModified = Date.now();
    next();
});

contactSchema.pre('findOneAndUpdate', function (next) {
    this.set({ lastModified: Date.now() });
    next();
});

// Create the model for contacts
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;