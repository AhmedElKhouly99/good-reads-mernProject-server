const joi = require('joi');
const {inputErr} = require('../../../helpers/customErrors')
const userUpdatingSchema = joi.object({
    firstName:joi.string().min(1),
    lastName: joi.string().min(1),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
    date_of_birth: joi.date(),
    gender : joi.string().min(1).valid("male","female"),
    country :joi.string().min(1),
    email : joi.string().email(),
    books: joi.object()
});
const updateValidation = async (req, res, next) =>{
    try {
        const validated = await userUpdatingSchema.validateAsync(req.body);
        req.body = validated;
        next();
    } catch (error) {
        if(error.isJoi) 
            next(inputErr);
        next(error);
    }
   

}

module.exports = updateValidation;