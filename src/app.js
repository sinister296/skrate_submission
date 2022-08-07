const express = require('express')
const User = require('./models/user')
const Ticket = require('./models/ticket')
require('./dataBase/mongoose')

const app = express()


app.use(express.json())


app.post('/users/new', async (req, res) => {
    const user = new User(req.body)
    console.log(user)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

app.post('/tickets/new', async (req, res) => {
    const ticket = new Ticket({
        ...req.body,
        owner: req.user._id
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

app.delete('/tickets/delete', (req, res) => {
    res.send('Ticket Deleted')
})

module.exports = app