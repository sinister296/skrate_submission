const mongoose = require('mongoose')
const jwl = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    role: {
        type: String
    },
    tokens:[{
        token: {
            type: String
        }
    }]
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

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User