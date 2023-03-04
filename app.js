require("dotenv").config({path: "./config.env"});  
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 
const cookieParser = require('cookie-parser')
app.use(express.static(__dirname+ "/views/"));

require("./db/conn");
// linking router file to make route easy.
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(require("./router/auth"));
app.use(cookieParser());


app.get("/", function (req, res) {
  res.sendfile(__dirname+ "/views/index.html");
  });
 

app.listen(process.env.PORT || 5000, function(){
    console.log("Server started on port 5000");
})