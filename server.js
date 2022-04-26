const express = require('express');
const app  = express();
const db = require('./database/dbConnection');
const path = require('path');
const morgan = require('morgan');
// const favicon = require('serve-favicon');
const usersRouter = require('./routers/users/usersRouter');
require('dotenv').config();

app.use(express.urlencoded());
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('combined'));
app.use(['/user', '/users'], usersRouter);


app.use((err, req, res, next) => {
    if(!err.status){
        err.message = 'something went wrong';
        console.log(err);
        //send mail
        //log on server
    }
    else if(err.code === 'VALIDATION_ERROR'){
        
    }

    res.status(err.status || 500).send(err.message);
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});



//....................................................



// app.use(favicon(path.join(__dirname, 'staticFiles', 'images', 'favicon.ico')));

// app.use(express.static('staticFiles', {
//         index: 'html/home.html'
//     })
// );

// app.get('/home', (req, res)=>{
//     htmlFilePath = path.join(__dirname, 'staticFiles', 'html', 'home.html');
//     res.sendFile(htmlFilePath);
// });
