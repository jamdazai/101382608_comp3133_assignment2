/**
 * @author: Jam Furaque
 */

// THIS SCHEMA OR MODEL IS FOR OUR USERS.
// WE WANT TO BUILD OUR USERS AS PER
// THE INSTRUCTIONS PROVIDED.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre('save', async function (next) {                      // are you wondering what is this?
    if (!this.isModified('password')) return next();                // this simplye means that
    try {                                                           // before saving the user to the database
        const salt = await bcrypt.genSalt(10);                      // we hash their password.
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    }catch (error) {
        next(error);
    }});

const User = mongoose.model('User', userSchema);
module.exports = User;