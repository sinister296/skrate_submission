const express = require('express')
const User = require('./models/user')
const Ticket = require('./models/ticket')
const auth = require('./middleware/auth')
const morgan = require('morgan')
require('./dataBase/mongoose')

const app = express()


app.use(express.json())
app.use(morgan('combined'))

app.get('/', (req, res) => {
    res.send('App is up and running.')
});


// Creates New User
// Default role: employee
app.post('/users/new', async (req, res) => {

    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ token})
    } catch (e) {
        res.status(400).send(e)
    }
});



// Gets all tickets
app.get('/tickets/all', async (req, res) => {
    try {

        const tickets = await Ticket.find()
        res.send(tickets)
    } catch (e) {
        res.status(400).send(e)
    }
});



//Gets tickets with parameters
app.get('/tickets/', async (req, res) => {
    try {
        const filters = {};

        if(req.query.priority) {
            filters.priority = req.query.priority
        }

        if(req.query.status) {
            filters.status = req.query.status
        }

        if(req.query.title) {
            filters.title = req.query.title
        }

        console.log(filters)
        const tickets = await Ticket.find(filters)
        res.send(tickets)
    } catch (e) {
        res.status(400).send(e)
    }
});


// Creates new ticket
// Admin auth required
// Default priority: low
// Default status: open
app.post('/tickets/new', auth, async (req, res) => {
    
    try {

        const user = await User.findOne({role: 'employee'})

        const ticket = new Ticket({
            ...req.body,
            assignedTo: user.username
        })

        await ticket.save()
        res.status(201).send(`${ticket.title} assigned to ${user.username}`)
    } catch (e) {
        res.status(400).send(e)
    }
});


// Marks ticket as closed
// Admin auth required
app.post('/tickets/markAsClosed', auth, async (req, res) => {
    
    try {
        const ticketID = req.body.ticketID
        const ticket = await Ticket.findById({_id: ticketID})
        const allTickets = await Ticket.find({assignedTo: ticket.assignedTo})
        const highPriority = false
        allTickets.forEach(highPrioityTicketActive)

        function highPrioityTicketActive(thisTicket) {
            if(thisTicket.priority === high)
                highPriority = true
        }

        if(highPriority){
            throw new Error()
        }

        ticket.status = 'closed'
        ticket.save()

        res.send(ticket)
    } catch (e) {
        res.status(400).send('error: A higher priority task remains to be closed')
    }
});



// Deletes a ticket
// Admin auth required
app.post('/tickets/delete', auth, async (req, res) => {
    try {
        const id = req.body.id
        const ticket = await Ticket.findOneAndDelete({ _id: id})
        res.send(ticket)
    } catch (e) {
        res.status(500).send(e)
    }
});

module.exports = app