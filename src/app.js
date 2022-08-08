const express = require('express')
const User = require('./models/user')
const Ticket = require('./models/ticket')
const auth = require('./middleware/auth')
require('./dataBase/mongoose')

const app = express()


app.use(express.json())

app.get('/', (req, res) => {
    res.send('App is up and running.')
});


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

app.get('/tickets/all', async (req, res) => {
    try {

        const tickets = await Ticket.find()
        res.send(tickets)
    } catch (e) {
        res.status(400).send(e)
    }
});

app.get('/tickets/', async (req, res) => {
    try {
        const tickets = await Ticket.find()
        res.send(tickets)
    } catch (e) {
        res.status(400).send(e)
    }
});

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