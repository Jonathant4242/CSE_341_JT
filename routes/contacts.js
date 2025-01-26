const express = require('express');
const Contact = require('../models/contacts'); // Import the Contact model
const router = express.Router();
const Joi = require('joi'); // Import Joi for validation

// Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find(); // Fetch all contacts
        res.status(200).json(contacts); // Return the contacts as JSON
    } catch (err) {
        console.error(err); // Log the error to the console for debugging
        res.status(500).json({ error: 'Failed to fetch contacts', details: err.message });
    }
});

const contactUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
}).min(1); // Ensure at least one field is provided

// Create a new contact
router.post('/', async (req, res) => {
    const { firstName, lastName, email, phone, favoriteColor, birthday, tags } = req.body;

    // Validation: Ensure all required fields are provided
    if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    try {
        const newContact = new Contact({ firstName, lastName, email, phone, favoriteColor, birthday, tags });
        const savedContact = await newContact.save(); // Save to MongoDB
        res.status(201).json({ id: savedContact._id }); // Return only the ID of the saved contact
    } catch (err) {
        console.error('Error creating contact:', err.message);
        res.status(400).json({ error: 'Failed to create contact', details: err.message });
    }
});

// Get a specific contact by ID
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id); // Fetch contact by ID
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json(contact); // Return the contact
    } catch (err) {
        res.status(400).json({ error: 'Invalid contact ID', details: err.message });
    }
});

// Update a contact by ID
router.put('/:id', async (req, res) => {
    // Validate the request body
    const { error } = contactUpdateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: 'Validation failed', details: error.details });
    }

    try {
        // Add the `lastModified` timestamp
        req.body.lastModified = Date.now();

        // Update the contact in MongoDB
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Validate schema before saving
        });

        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Respond with the updated contact
        res.status(200).json({
            message: 'Contact successfully updated',
            contact: updatedContact,
        });
    } catch (err) {
        res.status(400).json({ error: 'Failed to update contact', details: err.message });
    }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
    // Validate the ID format before proceeding
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid contact ID format' });
    }

    try {
        // Log the ID being deleted for debugging
        console.log(`Attempting to delete contact with ID: ${req.params.id}`);

        // Attempt to delete the contact using the ID from the URL
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);

        // If no contact is found, return a 404 status with an error message
        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Log successful deletion for debugging
        console.log(`Successfully deleted contact with ID: ${req.params.id}`);

        // On successful deletion, return a 200 status with a success message and contact details
        res.status(200).json({ message: 'Contact deleted', contact: deletedContact });
    } catch (err) {
        // Log the error for debugging
        console.error(`Error deleting contact with ID: ${req.params.id}`, err);

        // Handle invalid ID or other errors with a 400 status
        res.status(400).json({ error: 'Failed to delete contact', details: err.message });
    }
});

module.exports = router;