// const util = require('util');
const express = require('express');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const {customError, authError} = require('../../helpers/customErrors');
const BookModel = require('./bookModel');
const bookRouter = express.Router();
var cors = require('cors');
const { authorizeUser, authorizeAdmin } = require('../../helpers/middlewares');
bookRouter.use(cors())
bookRouter.use((req,res, next)=> {
    console.log(req.url);
    next();
});

bookRouter.post('/', authorizeAdmin, async (req, res, next) => {
    const { name,CategoryId,AuthorId} = req.body;
    // const { token } = req.headers;
    try {
        
        await BookModel.create({ name,CategoryId,AuthorId});
        res.send({success: true});
    } catch (error) {
        next(error);
    }
});

bookRouter.get('/', async (req, res, next)=> {

    try {
        const books = await BookModel.find({});
        res.send(books);
    } catch (error) {
        next(error);
    }
    
});

bookRouter.patch('/:id', authorizeAdmin, async (req, res,next)=> {
    const { id } = req.params;
    try {
        await BookModel.findByIdAndUpdate(id, {$set: req.body});
        res.send({message: 'updated successfully'}); 
    } catch (error) {
        next(error);
    }
});

bookRouter.delete("/:id", authorizeAdmin, async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    try {
      await BookModel.findByIdAndDelete(id);
      res.send({ message: "successfully deleted" });
  
    } catch (error) {
      next(error);
    }
  });
module.exports = bookRouter;