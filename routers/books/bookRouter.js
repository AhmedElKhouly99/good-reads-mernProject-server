// const util = require('util');
const express = require('express');
var bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const { customError, authError } = require('../../helpers/customErrors');
const BookModel = require('./bookModel');
const UsersModel = require("../users/usersModel")
const addValidation = require("./validation/bookAdd");
const updateValidation = require('./validation/bookUpdate');
const bookRouter = express.Router();
var cors = require('cors');
bookRouter.use(bodyParser.json({ limit: "50mb" }));
bookRouter.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

const { authorizeUser, authorizeAdmin, getUserId } = require('../../helpers/middlewares');

bookRouter.use(cors())
bookRouter.use((req, res, next) => {
    console.log(req.url);
    next();
});

bookRouter.post('/', authorizeAdmin, addValidation, async (req, res, next) => {

    const { name, AuthorId, CategoryId, image } = req.body;
    try {

        await BookModel.create({ name, AuthorId, CategoryId, image, noOfRatings: 0, rating: 0 });
        // console.log(name,AuthorId,CategoryId,image);
        // await BookModel.create({ name,AuthorId,CategoryId,image});
        res.send({ success: true });
    } catch (error) {
        next(error);
    }
});


// bookRouter.get('/', async (req, res, next) => {
//     const { name } = req.query;
//     try {
//         const books = await BookModel.find({ name: new RegExp(name, "i") })
//         res.send(books);
//     }
//     catch (error) {
//         next(error);
//     }
// });


bookRouter.get('/', async (req, res, next) => {
    const { page, name } = req.query;
    let pages = 0;
    const limit = 6;
    try {
        if (page) {
            BookModel.count().then((count) => { pages = Math.ceil(count / limit) }).then(() => {
                BookModel.aggregate([



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

                    return res.send({ data, pages });

                }).skip((limit * page) - limit).limit(limit)
            })
        } else if (name) {
            const books = await BookModel.find({ name: new RegExp(name, "i") })
            res.send(books);
        } else {
            throw customError(404, "NOT_FOUND", "page not founf");
        }


    } catch (error) {
        next(error);
    }

});

bookRouter.patch('/rate', async (req, res, next) => {
    const { userRate, bookId, userId } = req.body;

    try {

        await BookModel.findByIdAndUpdate(bookId, { $inc: { noOfRatings: 1, rating: userRate } });
        await UsersModel.findOneAndUpdate(
            { '_id': userId, "books._id": bookId },
            { '$set': { 'books.$.rating': userRate } })

        res.send({ message: 'updated rating successfully' });
    } catch (error) {
        next(error);
    }
})

bookRouter.get("/popular", async (req, res, next) => {
    try {
        const popularBooks = await (await BookModel.find({}).sort({ rating: 1 })).splice(-3).reverse();
        res.status(200).send(popularBooks);
    } catch (error) {
        next(error);
    }
})


bookRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const books = await BookModel.findById(id);
        res.send(books);
    } catch (error) {
        next(error);
    }

});

bookRouter.patch('/:id', updateValidation, authorizeAdmin, async (req, res, next) => {

    const { id } = req.params;
    try {
        await BookModel.findByIdAndUpdate(id, { $set: req.body });
        res.send({ message: 'updated successfully' });
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