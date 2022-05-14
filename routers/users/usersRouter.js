const express = require("express");
const { dirname } = require("path"); //to facilitate file paths
const path = require("path"); // to facilitate file paths
const fs = require("fs/promises"); // to use async & await with fs
const bcrypt = require("bcrypt"); // for encryption
const jwt = require("jsonwebtoken");
const util = require("util"); // a library to promisify jwt functions (sign,verify)
const signAsync = util.promisify(jwt.sign); // used in sign and create token
const usersModel = require("./usersModel");
const { customError, authError,  } = require("../../helpers/customErrors");
const addValidation = require("./validation/userAdd");
const { authorizeUser } = require('../../helpers/middlewares');
const updateValidation = require('./validation/userUpdate');
const categoriesRouter = require("../categories/categoryRouter")
const authorsRouter = require("../authors/authorRouter")
const booksRouter = require("../books/bookRouter")
// creation of Router
const usersRouter = express.Router();
usersRouter.use(['/category', '/categories'], categoriesRouter);
usersRouter.use(['/author', '/authors'], authorsRouter);
usersRouter.use(['/book', '/books'], booksRouter);
//........................adding...........//
usersRouter.post("/signup", addValidation, async (req, res, next) => {
  const { firstName, lastName, email, password, date_of_birth, gender, country } =
    req.body;
    if(await usersModel.findOne({ email })) return res.send({ failed: "Email already exists !" });
    
  try {
    const saltRounds = 12; // with make the number bigger we make things hard for the hackers
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await usersModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      date_of_birth,
      gender,
      country,
    });
    res.send({ success: true });
  } catch (error) {
    next(error); // that error is handeled by app.use(err,req,res,next) in the serve page
  }
});

//..................................login..............................//

usersRouter.post("/login", async (req, res, next) => {
  try {
    const secretKey = process.env.SECRET_KEY; // WE SAVED THE KEY IN .env file
    const { email, password } = req.body;
    const user = await usersModel.findOne({ email }); //return the full car object
    if (!user) throw authError;
    const result = await bcrypt.compare(password, user.password); //return true or false
    if (!result) throw authError;
    const token = await signAsync(
      {
        id: user.id,
        admin: false,
      },
      secretKey
    ); //first parameter is data(payload) , second is secret key

    res.send({token, id:user.id});
  } catch (error) {
    next(error);
  }
});

// //....................................Updating.............................//

usersRouter.patch('/:id', updateValidation, authorizeUser,async (req,res,next) => {
  const {id} = req.params;
  const {password} = req.body;
  try {
    const saltRound = 12;
    const hashedPassword = password ? await bcrypt.hash(password, saltRound) : undefined;
    req.body.password = hashedPassword;
    await usersModel.findByIdAndUpdate(id,{$set:req.body})
    res.send({message: "Updatted Successfully"});
  } catch (error) {
    next(error)
  }

});


// usersRouter.get()



// usersRouter.patch('/:userId', authorizeUser, async (req, res, next) => {
//   const {userId} = req.params;
//   const {password} = req.body;
//   try {
//       const saltRound = 12;
//       const hashedPassword = password ? await bcrypt.hash(password, saltRound) : undefined;
//       req.body.password = hashedPassword;
//       await users.findByIdAndUpdate(userId, {$set: req.body});
//       res.send({message: "Updated Successfully"});
//   } catch (error) {
//       next(error);
//   }
// });







// const { authorizeUser } = require('./middlewares');

//...............................Incremental ID..........................//

// generateID= ()=> {
//   if (cars.length)
//   {
//     return cars[cars.length-1].id +1
//   }
//   else
//   {
//    return 1 ;
//   }
//   }



//   // .......................................Listing......................//
//   carsRouter.get('/', async(req,res,next) => {

//   const {name} = req.query;
//   const filter = name ? {name} : {} ;    //يعني لو باعتله اسم هي فايند بيه لو مش باعت اسم في ال يو ار ال هيجيب كله
//   try {
//     const returnedCars = await carsModel.find(filter);
//     res.send(returnedCars);
//   } catch (error) {
//     next(error);     // that error is handeled by app.use(err,req,res,next) in the serve page
//   }

//   })




//   // //.............................Using Request Params.......................//

//   carsRouter.get('/:id', async(req, res,next)=>{
//     const { id } = req.params;     // we get it from studio 3t to test ..
//     try {
//       const car = await carsModel.findById(id);  // findById is built in from mongose queries
//     // we can use find like this to like mongo
//     // const car = await carsModel.find({_id:id});
//     res.send(car);
//     } catch (error) {
//      next(error)
//     }

//   });
// //............................Static Files In Folder............//
// carsRouter.use(express.static('staticFolder'))
// // i can access all files in this folder without Handling any request
// // i can say in browser : localhost:3000/home.html

module.exports = usersRouter;
