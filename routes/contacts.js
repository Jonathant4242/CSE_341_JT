const express = require('express');
const Contact = require('../models/contacts'); // Import the Contact model
const router = express.Router();
const Joi = require('joi'); // Import Joi for validation
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API Endpoints related to Contacts
 */

// 🔹 GET All Contacts
/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Retrieve all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Successfully retrieved contacts
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch contacts', details: err.message });
    }
});

// 🔹 GET a Specific Contact by ID
/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact found
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Contact not found
 */
router.get('/:id', async (req, res) => {
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
});

// 🔹 Create a New Contact
/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Validation error
 */
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

// 🔹 Update a Contact
/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Contact not found
 */
router.put('/:id', async (req, res) => {
    const { error } = Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().email().optional(),
        phone: Joi.string().optional(),
        favoriteColor: Joi.string().optional(),
        birthday: Joi.date().optional(),
        tags: Joi.array().items(Joi.string()).optional()
    }).min(1).validate(req.body);

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

        res.status(200).json({ message: 'Contact successfully updated', contact: updatedContact });
    } catch (err) {
        res.status(400).json({ error: 'Failed to update contact', details: err.message });
    }
});

// 🔹 Delete a Contact
/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       400:
 *         description: Invalid contact ID format
 *       404:
 *         description: Contact not found
 */
router.delete('/:id', async (req, res) => {
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
});

module.exports = router;
