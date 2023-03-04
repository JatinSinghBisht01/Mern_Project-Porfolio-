const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("../db/conn");
const User = require("../model/userSchema");
const cookieParser = require('cookie-parser');
const Authenticate = require("../middleware/authenticate");

router.use(cookieParser());

router.get("/", (req, res)=>{
    res.send("Hello world to server router js");

});

router.post("/register", (req, res)=>{
  
  bcrypt.hash(req.body.password, 12, function (err, hash) { 
    const newUser = new User({
      name:req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      work: req.body.work,
      password: hash,
      cpassword: hash
      
    });
   
    if(!newUser.name || !newUser.email || !newUser.phone || ! newUser.work || !newUser.password || !newUser.cpassword){
      return res.status(422).json({error: "Plz fill the required field"});
    }
    User.findOne({email: newUser.email}, function (err, userExist) { 
      if(err){
        console.log(err);
        return res.status(500).json({error: "failed to register"});
      }else{
        if(userExist){
          return res.status(422).json({error: "Email already Exist"});
        }else{
          if(req.body.password === req.body.cpassword){
           // Create token
              const email = req.body.email;
              const token = jwt.sign(
                { user_id: newUser._id, email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "10h",
                
                }
              );
              newUser.tokens = newUser.tokens.concat({token: token});
              // res.status(201).json(newUser);
              console.log(newUser);
              newUser.save();
              return res.status(201).json({message: "user registered succesfully"});
          }
          else{
            return res.status(422).json({error: "Password and Confirm password field don't match"});
          }
        }
      }
     });

   });
  });

  //LOgin route
  router.post("/signin", (req, res)=>{
    if(!req.body.email || !req.body.password){
      return res.status(400).json({error: "Plz fill the required data"});
   }else{
      User.findOne({email: req.body.email}, function (err, foundUser) {
        if(err){
          console.log(err);
        }else{
          if(foundUser){
             bcrypt.compare(req.body.password, foundUser.password, function (err, result) {
                  if(result){
                    return res.json({message: "successfully log in"})
                  }else{
                    return res.json({message: "incorrect password"});
                  }
              });
              const email = req.body.email;
              const token = jwt.sign(
                { user_id: foundUser._id, email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "10h",
                }
              );
              foundUser.tokens = foundUser.tokens.concat({token: token});
              foundUser.save();
               // I am confuse what are you trying to do here, in your place I would set up on the cookie since you do that on your authentification.
               res.cookie("jwt", token, {
                maxAge: 300000,  // 5 mins for testing(1000 is factor)
                httpOnly: true,
                sameSite: false,  //false only for dev
                secure: false,   //false only for dev
            })
              
              // res.status(200).json(foundUser);
              // console.log(foundUser);
          }else{
            return res.status(400).json({message: "user not found"});
          };
        }
      })

  }
  });

  //about us page
  router.get("/profile", Authenticate, function (req, res) {
    console.log("profile running");
    res.send(req.user);
  });

  router.get("/getdata", Authenticate, function (req, res) {
    console.log("getting data");
    res.send(req.user);
  });

  router.post("/contact", Authenticate, async  (req, res) =>{
    try {
      const {name, email, phone, message} = req.body;
      if(!name || !email || !phone || !message){
        console.log("error in contact form");
        return res.json({error: "plz fill all details"})
      }
      const userContact =  await User.findOne({_id: req.userID});
      if(userContact){
        const userMessage = await userContact.addMessage(name, email, phone, message);
        await userContact.save();
        res.status(201).json({message:"Message shared successfully"});
      }
    } catch (error) {
      console.log(error);
    }
  });

  //edit page
  router.get("/edit", Authenticate, function (req, res) {
    console.log("edit running");
    res.send(req.user);
  });

  router.post("/edit", Authenticate, async(req, res) =>{
    try {
      const {name, phone, work} = req.body;
      console.log("edit req running");
      if(!name || !work || !phone){
        console.log("error in edit form");
        return res.json({error: "plz fill all details"})
      }
      const userEdit =  await User.findByIdAndUpdate({_id: req.userID}, {$set:{name, phone, work}});
      if(userEdit){
        // const updatedProfile = await userEdit.updatedProfile()
        await userEdit.save();
        res.status(201).json({message: "Profile edited successfully"});

      }
      
    } catch (error) {
      console.log(error);
    }
  })

  

   //logout page
   router.get("/logout", function (req, res) {
    console.log("logout running");
    res.clearCookie("jwt", {path:"/"});
    res.status(200).send("User logout");
  });

module.exports = router;