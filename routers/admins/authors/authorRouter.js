// const util = require('util');
const express = require('express');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const {customError, authError} = require('../../../helpers/customErrors');
const AuthorModel = require('./authorModel');
const authorRouter = express.Router();
var cors = require('cors')
authorRouter.use(cors())
authorRouter.use((req,res, next)=> {
    console.log(req.url);
    next();
});


authorRouter.post('/', async (req, res, next) => {
    const { firstName,lastName,dateOfBirth} = req.body;
    try {
    
        await AuthorModel.create({ firstName,lastName,dateOfBirth});
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