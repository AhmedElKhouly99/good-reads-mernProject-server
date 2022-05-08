// const util = require('util');
const express = require('express');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const {customError, authError} = require('../../../helpers/customErrors');
const CategoryModel = require('./categoryModel');
const categoryRouter = express.Router();
var cors = require('cors')
categoryRouter.use(cors())
categoryRouter.use((req,res, next)=> {
    console.log(req.url);
    next();
});


categoryRouter.post('/', async (req, res, next) => {
    const { name} = req.body;
    try {
        
        await CategoryModel.create({ name});
        res.send({success: true});
    } catch (error) {
        next(error);
    }
});

categoryRouter.get('/', async (req, res, next)=> {

    try {
        const categories = await CategoryModel.find({});
        res.send(categories);
    } catch (error) {
        next(error);
    }
    
});

categoryRouter.get('/:id', async (req, res, next)=> {
    const { id } = req.params;
    try {
        const categories = await CategoryModel.findById(id);
        res.send(categories);
    } catch (error) {
        next(error);
    }
    
});

categoryRouter.patch('/:id' ,async (req, res,next)=> {
    const { id } = req.params;
    try {
        await CategoryModel.findByIdAndUpdate(id, {$set: req.body});
        res.send({message: 'updated successfully'}); 
    } catch (error) {
        next(error);
    }
});

categoryRouter.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    try {
      await CategoryModel.findByIdAndDelete(id);
      res.send({ message: "successfully deleted" });
  
    } catch (error) {
      next(error);
    }
  });
module.exports = categoryRouter;