const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
        
    },
    role: {
        type: String,
        default: "employee",
        enum : ['employee','admin'],
    },
    token:{
        type: String
    }
}, {
    timestamps: true
})

userSchema.virtual('tickets', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString() }, "skrateusertoken")

    user.token = token
    await user.save()
    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User