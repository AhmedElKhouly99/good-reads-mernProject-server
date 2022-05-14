// const util = require('util');
const express = require('express');
var bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const { customError, authError } = require('../../helpers/customErrors');
const BookModel = require('./bookModel');

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

bookRouter.post('/', async (req, res, next) => {
    const { name, AuthorId, CategoryId, image } = req.body;

    try {

        await BookModel.create({ name, AuthorId, CategoryId, image });
        res.send({ success: true });
    } catch (error) {
        next(error);
    }
});

bookRouter.get('/', async (req, res, next) => {

    try {

        BookModel.aggregate([{
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
        }
        ], function (error, data) {
            return res.send(data);

        })

    } catch (error) {
        next(error);
    }

});

bookRouter.get("/popular", async (req, res, next) => {
    try {
        console.log("hjklkjhjk");
        // .sort({name: -1})
        const popularBooks = await BookModel.find().sort({name: -1});
        res.send({popularBooks}); 

        res.status(200).send({ message: "successfully deleted" });
    } catch (error) {
        next(error);
    }
});

bookRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const books = await BookModel.findById(id);
        res.send(books);
    } catch (error) {
        next(error);
    }

});

bookRouter.patch('/:id', async (req, res, next) => {

    const { id } = req.params;
    try {
        await BookModel.findByIdAndUpdate(id, { $set: req.body });
        res.send({ message: 'updated successfully' });
    } catch (error) {
        next(error);
    }
});


bookRouter.delete("/:id", async (req, res, next) => {
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