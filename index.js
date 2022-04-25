const express = require('express');
const app  = express();
const db = require('./database/dbConnection');


app.use(express.urlencoded());
const port = process.env.PORT || 5000;


app.get("/", (req, res)=>{
    res.send("Hello world !");
});





app.listen(port, () => {
    console.log(`app listening on port ${port}`)
});