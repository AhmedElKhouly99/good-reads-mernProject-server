const mongoose = require('mongoose');
const usersSchema =  new mongoose.Schema({
     firstName:  {type :"string", required:true},
     lastName: {type :"string", required:true},
     email : {type :"string", required:true},
     password : {type :"string", required:true},
     age: {type :"number", required:true},
     gender:{type :"string", required:true},
     country : {type :"string", required:true}
     
     });

module.exports = usersSchema ; 