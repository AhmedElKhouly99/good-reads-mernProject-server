// const util = require('util');
const express = require('express');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const {customError, authError} = require('../../helpers/customErrors');
const AuthorModel = require('./authorModel');
const authorRouter = express.Router();
var cors = require('cors');
const updateValidation = require('./validation/authorUpdate');
const addValidation = require("./validation/authorAdd");
const { authorizeAdmin } = require('../../helpers/middlewares');
const BookModel = require('../books/bookModel');

authorRouter.use(cors())
var bodyParser = require('body-parser');
authorRouter.use(bodyParser.json({limit: "50mb"}));
authorRouter.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
authorRouter.use((req,res, next)=> {
    console.log(req.url);
    next();
});

authorRouter.post('/',authorizeAdmin,addValidation, async (req, res, next) => {
    const { firstName,lastName,dateOfBirth,image} = req.body;
    try {
        
        await AuthorModel.create({ firstName,lastName,image,dateOfBirth});
        res.send({success: true});
    } catch (error) {
        next(error);
    }
});

authorRouter.get('/', async (req, res, next)=> {
    const {page} = req.query;
    let pages = 0;
    const limit = 6;
    try {
        await AuthorModel.count().then((count) => {pages =Math.ceil(count/limit)});  
       const authors= await AuthorModel.find({}).skip((limit * page)-limit).limit(limit);
          res.send({authors,pages});

    }
     catch (error) {
        next(error);
    }

 
    
});

authorRouter.get("/popular", async (req, res, next) => {
    let authorsArray= [];

    try {
        let popularAuthors = await BookModel.aggregate([
            { $group : { _id : "$AuthorId", authors: { $push: "$name" } } },
            { $project: {
                _id: 1,
                numberOfBooks: { $cond: { if: { $isArray: "$authors" }, then: { $size: "$authors" }, else: "NA"} }
             } },
            { $sort  : { numberOfBooks: 1 }},
        ])

        popularAuthors = popularAuthors.slice(-3).reverse();
        
        for(let i=0 ; i<3; i++){
            const myId = (popularAuthors[i]._id[0]);
            authorsArray.push(await AuthorModel.findById(myId));
            if(i == 2){
                res.send(authorsArray);
            }
        }
        
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

authorRouter.patch('/:id' , authorizeAdmin, async (req, res,next)=> {

    const { id } = req.params;
    try {
        await AuthorModel.findByIdAndUpdate(id, {$set: req.body});
        res.send({message: 'updated successfully'}); 
    } catch (error) {
        next(error);
    }
});

authorRouter.delete("/:id",authorizeAdmin,updateValidation, async (req, res, next) => {
    const { id } = req.params;
    try {
      await AuthorModel.findByIdAndDelete(id);
      res.send({ message: "successfully deleted" });
  
    } catch (error) {
      next(error);
    }
  });




module.exports = authorRouter;