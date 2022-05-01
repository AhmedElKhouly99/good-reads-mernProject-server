const joi = require('joi');
const {inputErr} = require('../../../helpers/customErrors')
const userAddingSchema = joi.object({
    firstName:joi.string().min(1).required(),
    lastName: joi.string().min(1).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
    date_of_birth: joi.string(),
    gender : joi.string().min(1).valid("male","female").required(),
    country :joi.string().min(1).required(),
    email : joi.string().email().required()
});
const addValidation = async (req, res, next) =>{
    try {
        const validated = await userAddingSchema.validateAsync(req.body);
        req.body = validated;
        next();
    } catch (error) {
        if(error.isJoi) 
            next(inputErr);
        next(error);
    }
   

}

module.exports = addValidation;