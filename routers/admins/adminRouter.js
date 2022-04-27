const util = require('util');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const signAsync = util.promisify(jwt.sign);
const {customError, authError} = require('../../helpers/customErrors');
const AdminModel = require('./adminModel');
const adminRouter = express.Router();

adminRouter.use((req,res, next)=> {
    console.log(req.url);
    next();
});


// adminRouter.post('/', async (req, res, next) => {
//     const {username, password} = req.body;
//     try {
//         const saltRounds = 12;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
    
//         // const user = new AdminModel({username, password});
//         // await user.save();

//         await AdminModel.create({username, password: hashedPassword});
//         res.send({success: true});
//     } catch (error) {
//         next(error);
//     }
// });

adminRouter.post('/login', async (req, res, next)=> {
    const { username, password } = req.body;
    try {
        console.log(username,password)
        const user = await AdminModel.findOne({username});
        if(!user) throw authError;
        const result = await bcrypt.compare(password, user.password);
        if(!result)throw authError;

        const token = await signAsync({
            id: user.id,
            admin: true
        }, process.env.SECRET_KEY);

        res.send({ token });
    } catch (error) {
        next(error);
    }
     
})

module.exports = adminRouter;