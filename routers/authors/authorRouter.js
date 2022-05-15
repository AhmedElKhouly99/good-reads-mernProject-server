// const util = require('util');
const express = require('express');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const {customError, authError} = require('../../helpers/customErrors');
const AuthorModel = require('./authorModel');
const authorRouter = express.Router();
var cors = require('cors');
const { authorizeAdmin } = require('../../helpers/middlewares');
authorRouter.use(cors())
var bodyParser = require('body-parser');
authorRouter.use(bodyParser.json({limit: "50mb"}));
authorRouter.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
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