const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    IDnumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    position: [
        {
            lat: {
                type: String,
                required: true
            },
            lng: {
                type: String,
                required: true
            },
        },
    ],
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Client', clientSchema);