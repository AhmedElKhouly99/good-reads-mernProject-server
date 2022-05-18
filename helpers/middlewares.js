const util = require('util');
const jwt = require('jsonwebtoken');
const { authorizationError } = require('./customErrors');

const verifyAsync = util.promisify(jwt.verify);   //function used to verify token
let userId;
exports.authorizeUser = async ( req, res, next ) => {
    const { token } = req.headers;
    // const { id } = req.params;
    const secretKey = process.env.SECRET_KEY;
    try {
        const payload = await verifyAsync(token, secretKey);
        // if(id !== payload.id) throw authorizationError;
    } catch (error) {
        next(authorizationError);
    }
    next();
};
// exports.getUserId = () => {
//     return userId;
// };

exports.authorizeAdmin = async ( req, res, next ) => {
    const { token } = req.headers;
    const secretKey = process.env.SECRET_KEY;
    try {
        const payload = await verifyAsync(token, secretKey);
        if(!payload.admin) throw authorizationError;
    } catch (error) {
        next(authorizationError);
    }
    next();
};