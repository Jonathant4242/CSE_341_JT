const Contact = require('../models/contacts');
const mongoose = require('mongoose');

// GET all contacts
exports.getAll = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch contacts', details: err.message });
    }
};

// GET a single contact by ID
exports.getSingle = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid contact ID format' });
    }

    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// POST - Create a new contact
exports.createContact = async (req, res) => {
    let { firstName, lastName, email, phone, favoriteColor, birthday, tags } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    if (birthday) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(birthday)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        }
        birthday = new Date(birthday);
    }

    try {
        const newContact = new Contact({ firstName, lastName, email, phone, favoriteColor, birthday, tags });
        const savedContact = await newContact.save();
        res.status(201).json({ id: savedContact._id });
    } catch (err) {
        res.status(400).json({ error: 'Failed to create contact', details: err.message });
    }
};

// PUT - Update a contact
exports.updateContact = async (req, res) => {
    try {
        req.body.lastModified = Date.now();
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact successfully updated', contact: updatedContact });
    } catch (err) {
        res.status(400).json({ error: 'Failed to update contact', details: err.message });
    }
};

// DELETE - Remove a contact
exports.deleteContact = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid contact ID format' });
    }

    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted', contact: deletedContact });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete contact', details: err.message });
    }
};
