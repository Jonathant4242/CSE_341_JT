const express = require('express');
const Contact = require('../models/contacts'); // Import the Contact model
const router = express.Router();

// Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find(); // Fetch all contacts
        res.status(200).json(contacts); // Return the contacts as JSON
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// Create a new contact
router.post('/', async (req, res) => {
    try {
        const newContact = new Contact(req.body); // Create a new contact instance
        const savedContact = await newContact.save(); // Save to MongoDB
        res.status(201).json(savedContact); // Return the saved contact
    } catch (err) {
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
    try {
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Validate before updating
        });
        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json(updatedContact); // Return the updated contact
    } catch (err) {
        res.status(400).json({ error: 'Failed to update contact', details: err.message });
    }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id); // Delete contact
        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted', contact: deletedContact });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete contact', details: err.message });
    }
});

module.exports = router;