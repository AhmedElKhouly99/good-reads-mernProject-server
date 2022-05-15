// const util = require('util');
const express = require('express');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const {customError, authError} = require('../../helpers/customErrors');
const CategoryModel = require('./categoryModel');
const { authorizeUser, authorizeAdmin } = require('../../helpers/middlewares');
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

categoryRouter.get("/popular", async (req, res, next) => {
    try {
        let popularCategories = await CategoryModel.aggregate([
            { $group : { _id : "$CategoryId", categories: { $push: "$name" } } },
            { $project: {
                _id: 1,
                numberOfCategories: { $cond: { if: { $isArray: "$categories" }, then: { $size: "$categories" }, else: "NA"} }
             } },
            { $sort  : { numberOfCategories: 1 }}
            // { $slice: [ "$numberOfBooks", 3 ] }
        ])

        popularCategories = popularCategories.slice(-3).reverse();

        res.status(200).send(popularCategories);
    } catch (error) {
        next(error);
    }
})

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