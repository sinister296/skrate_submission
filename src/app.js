const express = require('express')
const User = require('./models/user')
const Ticket = require('./models/ticket')
const auth = require('./middleware/auth')
require('./dataBase/mongoose')

const app = express()


app.use(express.json())

app.get('/', (req, res) => {
    res.send('App is up and running.')
})


app.post('/users/new', async (req, res) => {

    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ token})
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/tickets/all', async (req, res) => {
    const filters = req.query
    try {
        res.send(filters)
    } catch (e) {
        res.status(400).send(e)
    }
});

app.post('/tickets/new', auth, async (req, res) => {
    const ticket = new Ticket({
        ...req.body
    })
    console.log(ticket)
    try {
        await ticket.save()
        res.status(201).send({ticket})
    } catch (e) {
        res.status(400).send(e)
    }
})

app.post('/tickets/markAsClosed', (req, res) => {
    res.send('Marked as Closed')
})

app.post('/tickets/delete', async (req, res) => {
    try {
        const id = req.body.id
        const ticket = await Ticket.findOneAndDelete({ _id: id})
        res.send(ticket)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = app