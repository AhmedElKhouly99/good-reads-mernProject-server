// const util = require('util');
const express = require('express');
var bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const { customError, authError } = require('../../helpers/customErrors');
const BookModel = require('./bookModel');
const addValidation = require("./validation/bookAdd");
const updateValidation = require('./validation/bookUpdate');
const bookRouter = express.Router();
var cors = require('cors');
bookRouter.use(bodyParser.json({ limit: "50mb" }));
bookRouter.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

const { authorizeUser, authorizeAdmin } = require('../../helpers/middlewares');

bookRouter.use(cors())
bookRouter.use((req, res, next) => {
    console.log(req.url);
    next();
});

bookRouter.post('/',authorizeAdmin,addValidation, async (req, res, next) => {
    
    const { name,AuthorId,CategoryId,image} = req.body;
    try {
        console.log(name,AuthorId,CategoryId,image);
        await BookModel.create({ name,AuthorId,CategoryId,image});
        res.send({success: true});
    } catch (error) {
        next(error);
    }
});

bookRouter.get('/', async (req, res, next) => {
        const {page} = req.query;
        let pages = 0;
        const limit = 6;
    try {
        BookModel.count().then((count) => {pages =Math.ceil(count/limit)}).then(()=>{  BookModel.aggregate([
        
        
       
            {
            $lookup: {
                from: "authors",
                localField: "AuthorId",
                foreignField: "_id",
                as: "author"
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "CategoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        ], function (error, data) {
            console.log(typeof data)
            // data['pages'] = pages
            console.log(data.pages)
            
            return res.send({data,pages});

        }).skip((limit * page)-limit).limit(limit)})

      

    } catch (error) {
        next(error);
    }

});

bookRouter.patch('/rate', async (req, res, next) => {
    const {rating, bookId} = req.body;
    try {
        // await BookModel.findByIdAndUpdate(bookId, {$set: {noOfRatings:noOfRatings++ , rating: ()}});
        res.send({message: 'updated successfully'}); 
    } catch (error) {
        next(error);
    }
})

bookRouter.get("/popular", async (req, res, next) =>{
    try {
        // let popularBooks = await BookModel.aggregate([
        //     { $group : { _id : {}, books: { $push: "$name" } } },
        //     { $project: {
        //         _id: 1,
        //         numberOfBooks: { $cond: { if: { $isArray: "$books" }, then: { $size: "$books" }, else: "NA"} }
        //      } },
        //     { $sort  : { numberOfBooks: 1 }}
        //     // { $slice: [ "$numberOfBooks", 3 ] }
        // ])

        const popularBooks = await (await BookModel.find({}).sort({_id: 1})).splice(3);

        // popularBooks = popularBooks.slice(-3).reverse();

        res.status(200).send(popularBooks);
    } catch (error) {
        next(error);
    }
})


bookRouter.get('/:id', async (req, res, next)=> {
    const { id } = req.params;

    try {
        const books = await BookModel.findById(id);
        res.send(books);
    } catch (error) {
        next(error);
    }

});

bookRouter.patch('/:id' ,updateValidation, authorizeAdmin,async (req, res,next)=> {

    const { id } = req.params;
    try {
        await BookModel.findByIdAndUpdate(id, { $set: req.body });
        res.send({ message: 'updated successfully' });
    } catch (error) {
        next(error);
    }
});


bookRouter.delete("/:id",authorizeAdmin, async (req, res, next) => {
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