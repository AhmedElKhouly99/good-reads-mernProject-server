const { number } = require('joi');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    // photo:'string,'
    rating: 'number',
    noOfRatings: 'number',
    name: 'string',
    CategoryId:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    AuthorId:[{ type: mongoose.Schema.Types.ObjectId,ref:'Author' }]
});

module.exports = bookSchema;
