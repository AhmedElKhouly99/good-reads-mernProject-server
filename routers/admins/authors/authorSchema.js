const mongoose = require('mongoose');
const authorSchema = new mongoose.Schema({
    
    // photo: 'string',
    firstName: 'string',
    lastName: 'string',
    dateOfBirth: 'date',


});

module.exports = authorSchema;
