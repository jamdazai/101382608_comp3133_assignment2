/**
 * @author: Jam Furaque
 */

// THIS FILE IS FOR OUR EMPLOYEE MODEL.
// WE'RE GOING TO BUILD THE SCHEMA
// WITH USE OF THE PROPERTIES THAT WAS PROVIDED 
// BY SIR PATEL IN THE ASSIGNMENT.

const mongoose = require('mongoose');
const { create } = require('./user');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    designation: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
        min: 1000,
    },
    date_of_joining:{
        type: Date,
        default: Date.now,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    employeePhoto: {
        type: String,
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

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;