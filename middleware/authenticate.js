require("dotenv").config({path: "./config.env"});  
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");



// const Authenticate = async(req, res, next) =>{
//     try {
//         const token = req.cookies.jwt;
//         const verifyToken = jwt.verify(token, process.env.TOKEN_KEY);
//         const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token});
//         if(!rootUser) {
//             throw new Error("User not found")
//         }
//         req.token = token;
//         req.rootUser = rootUser;
//         req.userID = rootUser._id;
//         next();
//     } catch (err) {
//         console.log(err);
//         return res.status(401).send("Unauthorized: No token provided");
//     }

// }

const Authenticate = async(req, res, next) => {
    const accessToken = req.cookies.jwt;
    if(!accessToken) {
        return res.status(401).json({error: "Unauthorized: No token provided"});
        
    }
        try {
            const user = jwt.verify(accessToken, process.env.TOKEN_KEY);
            const rootUser = await User.findOne({_id: user.user_id, "tokens.token": accessToken});
            if(user) {
                req.user = rootUser;
                req.userID = rootUser._id;
                return next();
            }
        } catch (error) {
            return res.status(403).json({error: "Forbidden token error"})
        }
}
module.exports = Authenticate;