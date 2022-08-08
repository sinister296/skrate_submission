const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: "open"
    },
    priority: {
        type: String,
        default: "low"
    },
    assignedTo: {
        type: String
    }
},{
    timestamps: true
})


ticketSchema.methods.findTickets = async function (filters) {
    console.log(filters)
}

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket