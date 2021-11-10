
const express = require("express");
const bodyParser= require("body-parser")
const session = require('express-session');
const app = express();

const PORT = 3000;

const routes = require('./routes');

app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: "anyrandomstring",
      })
    );
app.use(routes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT,()=>{
    console.log(`app running on port ${PORT}`);
})