const express = require('express');
const Contact = require('../models/contacts'); // Import the Contact model
const router = express.Router();
const Joi = require('joi'); // Import Joi for validation
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch contacts', details: err.message });
    }
});

// Get a specific contact by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID');
    }

    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).send('Contact not found');
        }
        res.send(contact);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Validation Schema for Contact Updates
const contactUpdateSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    favoriteColor: Joi.string().optional(),
    birthday: Joi.date().optional(),
    tags: Joi.array().items(Joi.string()).optional()
}).min(1); // At least one field is required

// Create a new contact
router.post('/', async (req, res) => {
    const { firstName, lastName, email, phone, favoriteColor, birthday, tags } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    try {
        const newContact = new Contact({ firstName, lastName, email, phone, favoriteColor, birthday, tags });
        const savedContact = await newContact.save();
        res.status(201).json({ id: savedContact._id });
    } catch (err) {
        console.error('Error creating contact:', err.message);
        res.status(400).json({ error: 'Failed to create contact', details: err.message });
    }
});

// Update a contact by ID
router.put('/:id', async (req, res) => {
    const { error } = contactUpdateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: 'Validation failed', details: error.details });
    }

    try {
        req.body.lastModified = Date.now();

        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid contact ID format' });
    }

    try {
        console.log(`Attempting to delete contact with ID: ${req.params.id}`);

        const deletedContact = await Contact.findByIdAndDelete(req.params.id);

        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        console.log(`Successfully deleted contact with ID: ${req.params.id}`);
        res.status(200).json({ message: 'Contact deleted', contact: deletedContact });
    } catch (err) {
        console.error(`Error deleting contact with ID: ${req.params.id}`, err);
        res.status(400).json({ error: 'Failed to delete contact', details: err.message });
    }
});

module.exports = router;
