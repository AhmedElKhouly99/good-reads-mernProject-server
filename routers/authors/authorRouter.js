// const util = require('util');
const express = require('express');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const {customError, authError} = require('../../helpers/customErrors');
const AuthorModel = require('./authorModel');
const authorRouter = express.Router();
var cors = require('cors');
const { authorizeAdmin } = require('../../helpers/middlewares');
const BookModel = require('../books/bookModel');

authorRouter.use(cors())
authorRouter.use((req,res, next)=> {
    console.log(req.url);
    next();
});

authorRouter.post('/', async (req, res, next) => {
    const { firstName,lastName,dateOfBirth,image} = req.body;
    try {
    
        await AuthorModel.create({ firstName,lastName,image,dateOfBirth});
        res.send({success: true});
    } catch (error) {
        next(error);
    }
});

authorRouter.get('/', async (req, res, next)=> {

    try {
        const authors = await AuthorModel.find({});
        res.send(authors);
    } catch (error) {
        next(error);
    }
    
});

authorRouter.get("/popular", async (req, res, next) => {
    try {
        let popularAuthors = await BookModel.aggregate([
            { $group : { _id : "$AuthorId", authors: { $push: "$firstName" } } },
            { $project: {
                _id: 1,
                numberOfAuthors: { $cond: { if: { $isArray: "$authors" }, then: { $size: "$authors" }, else: "NA"} }
             } },
            { $sort  : { numberOfAuthors: 1 }}
            // { $slice: [ "$numberOfBooks", 3 ] }
        ])
        popularAuthors = popularAuthors.slice(-3).reverse();

        res.send(popularAuthors);
    } catch (error) {
        next(error);
    }
})

authorRouter.get('/:id', async (req, res, next)=> {
    const { id } = req.params;
    try {
        const authors = await AuthorModel.findById(id);
        res.send(authors);
    } catch (error) {
        next(error);
    }
    
});

authorRouter.patch('/:id' ,async (req, res,next)=> {

    const { id } = req.params;
    try {
        await AuthorModel.findByIdAndUpdate(id, {$set: req.body});
        res.send({message: 'updated successfully'}); 
    } catch (error) {
        next(error);
    }
});

authorRouter.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
      await AuthorModel.findByIdAndDelete(id);
      res.send({ message: "successfully deleted" });
  
    } catch (error) {
      next(error);
    }
  });




module.exports = authorRouter;