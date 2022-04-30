const util = require('util');
const jwt = require('jsonwebtoken');
const { authorizationError } = require('../../helpers/customErrors');

const verifyAsync = util.promisify(jwt.verify);   //function used to verify token

exports.authorizeUser = async ( req, res, next ) => {
    const { token } = req.headers;
    const { id } = req.params;
    const secretKey = process.env.SECRET_KEY;
    try {
        const payload = await verifyAsync(token, secretKey);
        if(id !== payload.id) throw authorizationError;
    } catch (error) {
        next(authorizationError);
    }
    next();
};