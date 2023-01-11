require("dotenv").config({path: "./config.env"});  
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 
const cookieParser = require('cookie-parser')
app.use(express.static(__dirname+ "/views/"));

require("./db/conn");
// const User = require("./model/userSchema");
// linking router file to make route easy.
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(require("./router/auth"));
app.use(cookieParser());


//Middle-ware: function running before another func
// const Middleware = function (req, res, next) {
//     console.log("Middleware");
//     next();
//   }
// // 3. Heroku deploy
// if (process.env.NODE_ENV = "production"){
//   app.use(express.static("client/build"));
// }

app.get("/", function (req, res) {
  res.sendfile(__dirname+ "/views/index.html");
  });
 

app.listen(process.env.PORT || 5000, function(){
    console.log("Server started on port 5000");
})