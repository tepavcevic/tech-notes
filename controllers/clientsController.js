const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const Client = require('../models/Client');
const Note = require('../models/Note');

// @desc Get all clients
// @route GET /clients
// @access Private
const getAllClients = asyncHandler(async (req, res) => {
    const clients = await Client.find().lean();

    if (!clients?.length) {
        return res.status(204).json({ message: "No clients found." });
    }

    res.json(clients);
});

// @desc Create new client
// @route POST /clients
// @access Private
const createNewClient = asyncHandler(async (req, res) => {
    const { firstName, lastName, IDnumber, email, phone, street, city, position, active } = req?.body;
    const {lat, lng} = position || {};

    if (!firstName || !lastName || !IDnumber || !email || !phone || !street || !city || !lat || !lng || typeof active !== 'boolean') {
        return res.status(400).json({ message: "All client fields are required." });
    }

    const duplicate = await Client.findOne({ IDnumber }).collation({ locale: 'en', strength: 2 }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: "Client already exists." });
    }

    const clientObject = { firstName, lastName, IDnumber, email, phone, street, city, position, active }

    const client = await Client.create(clientObject);

    if (client) {
        res.status(201).json({ message: `New client ${client.firstName} created.` });
    } else {
        res.status(400).json({ message: "Invalid client data recieved." });
    }
});

// @desc Update a client
// @route PATCH /clients
// @access Private
const updateClient = asyncHandler(async (req, res) => {
    const { id, IDnumber, email, phone, street, city, position, active } = req?.body;
    const {lat, lng} = position || {};

    if (!id || !IDnumber || !email || !phone || !street || !city || !lat || !lng ||  typeof active !== 'boolean') {
        return res.status(400).json({ message: "All fields are required." });
    }

    const client = await Client.findById(id).exec();
    if (!client) {
        return res.status(400).json({ message: "Client not found." });
    }

    const duplicate = await Client.findOne({ IDnumber }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate client" });
    }

    client.email = email;
    client.phone = phone;
    client.street = street;
    client.city = city;
    client.position = position;
    client.active = active;

    const updatedClient = await client.save();

    res.json(`${updatedClient.email} updated.`);
});

// @desc Delete a client
// @route DELETE /clients
// @access Private
const deleteClient = asyncHandler(async (req, res) => {
    const { id } = req?.body;

    if (!id) {
        return res.status(400).json({ message: "Client ID required." });
    }

    const note = await Note.findOne({ client: id }).lean().exec();
    if (note) {
        return res.status(400).json({ message: "Client has assigned notes." });
    }

    const client = await Client.findById(id).exec();
    if (!client) {
        return res.status(400).json({ message: "Client not found." });
    }

    const result = await client.deleteOne();

    const reply = `Client ${result.firstName} with id ${result._id} deleted.`;
    res.json({ message: reply });
});

module.exports = { getAllClients, createNewClient, updateClient, deleteClient };