const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    },
    messages:[{
        name:{
            type:String,
            
        },
        email:{
            type:String,
           
        },
        phone:{
            type:Number,
            
        },
        message:{
            type:String,
            
        }
    }
    ],

    tokens:[
         { token:{
            type:String,
            required:true
         }

    }]

});

//storing message
userSchema.methods.addMessage = async function (name, email, phone, message) {
    try {
        this.messages = this.messages.concat({name, email, phone, message});
        await this.save();
        return this.messages;
    } catch (error) {
        console.log(error);
    }
}


const User = mongoose.model("User", userSchema);

module.exports = User;