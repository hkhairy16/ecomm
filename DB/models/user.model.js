// import { required } from 'joi';
import mongoose from 'mongoose'

const schema = new mongoose.Schema({

    name:{
        type: String,
        required:true,
        trim:true,
        },

     email:{
         type: String,
         trim:true,
        required:true,
        unique:true,
        },

        password:{
            type:String,
           required:true,
         minlenght:[4,"password is too short"]
         },

        phone:{
            type: String,
            required:true,
            maxLength:[11,"enter the correct number"]
            },

        verified:{
              type: Boolean,
             default: false
        },
           
            // role:{
            //     type: String,
            //     enums:["admin","user"],
            //     default:"User"
            // },
            
            loggedIn: {
                type: Boolean,
                default: false
        
            },
            forgetCode: {
                type:String
                
        
            },
           
            isActive:{
                type:Boolean,
                default:true
            },
            changePasswordAt:Date,
            isBlocked:{
                type:Boolean,
                default:false
            },



              image: String,
              
              wishList:[{
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Product"
              }],

              address: [{
                city: String,
                street: String,
                phone:String

              }],
        
            createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User"
             }
        
    },{
    timestamps: true
});




const userModel = mongoose.model("User", schema);




export default userModel;