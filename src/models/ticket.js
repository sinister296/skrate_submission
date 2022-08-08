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
        type: String,
        default: 'open',
        enum : ['open','closed'],
    },
    priority: {
        type: String,
        default: 'low',
        enum : ['low','medium','high'],
    },
    assignedTo: {
        type: String,
        default: 'notAssigned'
    }
},{
    timestamps: true
})


ticketSchema.methods.findTickets = async function (filters) {
    console.log(filters)
}

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket