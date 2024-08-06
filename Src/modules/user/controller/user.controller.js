import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../../../../DB/models/user.model.js";
// import { sendEmail,emailFunc } from "../../email/sendEmail.js";
import { handleError } from "../../../middleware/handlingError.js";
import { AppError } from "../../../utilities/AppError.js";
import { nanoid } from "nanoid";


// *************************************signUp*********************************************
export const signUp = handleError(async (req, res, next) => {
    const { name, email, password, phone } = req.body;
    // Check if email exists
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
        return next(new AppError("user already exist", 400));
    }
    // Check if phone exists
    const phoneExist = await userModel.findOne({ phone });
    if (phoneExist) {
        return next(new AppError("phone already exist", 400));
    }
    const phonePattern = /^01[0125][0-9]{8}$/;
    if (!phonePattern.test(phone)) {
        return next(new AppError("Invalid phone number", 400));
    }
    const hash = bcrypt.hashSync(password, +process.env.SALT_ROUND);
    try {
        let addedUser = await userModel.create({ name, email, password: hash, phone });
        // let verifyToken = jwt.sign({ id: addedUser._id }, process.env.VERIFY_SECRET);
        res.json({ message: "Added", addedUser });
    } catch (error) {
        next(new AppError("Failed to save user", 500)); // Handling any errors during saving
    }
});

// *************************************signIn*********************************************//
export const signIn = handleError(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if user exists
    const userExist = await userModel.findOne({ email: email?.toLowerCase() });
    if (!userExist) {
        return next(new AppError("User not found", 404));
    }

    // Compare passwords
    const match = bcrypt.compareSync(password, userExist.password);
    if (!match) {
        return next(new AppError("Incorrect email or password", 400));
    }

    if (!userExist.verified) {
        return res.json({ message: "Please verify your account" });
    }

    // Update user's loggedIn status + Generate JWT token
    try {
        await userModel.updateOne({ email }, { loggedIn: true });
        const token = jwt.sign(
            { id: userExist._id, email },
            process.env.SIGNATURE
        );
        res.json({ message: "Welcome", token });
    } catch (error) {
        next(new AppError("An error occurred while signing in", 500));
    }
});

export const verifyEmail = async (req, res, next) => {
    const { token } = req.params;

    jwt.verify(token, process.env.VERIFY_SECRET, async (err, decoded) => {
        if (err) {
            return next(new AppError("Invalid or expired token", 400));
        }

        try {
            const updatedUser = await userModel.findByIdAndUpdate(decoded.id, { verified: true }, { new: true });
            if (!updatedUser) {
                return next(new AppError("User not found", 404));
            }
            res.json({ message: "Success" });
        } catch (error) {
            next(new AppError("An error occurred while verifying the email", 500));
        }
    });
};

//*********************************Create User*************************************************/
export const createUser = handleError(async (req,res,next) => {
    let user = await userModel.findOne({email: req.body.email})
    if(user) return next(new AppError("Email already exist",409))
        let results = new userModel(req.body);
        let added = await results.save();
        res.json({ message: "Success",added})
});

// *************************************updateUser*********************************************
export const updateUser = handleError(async (req,res) =>{
    let {_id, name} = req.body;
    const updated =  await userModel.findByIdAndUpdate(_id, {name}, {new:true})
    res.json({message: "updateUser", updated});
})
   
// *************************************changePassword*********************************************
export const changePassword = handleError(async (req, res, next) => {
   let {id}=req.params;
   let results = await userModel.findByIdAndUpdate(id,req.body,{new:true});
   !results && next(new AppError("User not found",404));
   results && res.json({message:"Done",results})
   
   
})
// *************************************deleteUser*********************************************
export const deleteUser = handleError(async (req,res)=>{
    let deletedUser = await userModel.findByIdAndDelete(req.params.id)
    //console.log(deletedUser);
    if(deletedUser){
        res.json({message: "Deleted Successfully", deletedUser})

    }else{
        res.json({message: "User Not Found"})

    }
})

// *************************************getAllUsers*********************************************
export const getAllUsers =handleError(
    async (req,res)=>{
    let Allusers =await userModel.find()
    res.json({message:"done",Allusers})
}
) 
// *************************************getUserById*********************************************
export const getUserById =async (req,res)=>{
    let user =await userModel.findById(req.params.id);
    res.json({message:"done", user})
}
// ************************************forgetPassword*************************************
export const forgetPassword = handleError(async (req, res, next) => {
    const { email } = req.body

    const userExist = await userModel.findOne({ email })
    if (!userExist) {
        return next(new AppError("email not exist ", 404))
    }
    const code = nanoid(4)
    const emailSend = emailFunc({
        email,
        subject: "reset password",
        html: `<h1>code:${code}</h1>`
        
    })
    if (!emailSend) {
        return next(new AppError("fail to send this email", 400))
    }
    await userModel.updateOne({ email }, { forgetCode: code })
    res.status(200).json({ message: "Email sent" })

})
// ************************************resetPassword*************************************
export const resetPassword = handleError(async (req, res, next) => {
    const { email, code, password, confirmPassword } = req.body

    const userExist = await userModel.findOne({ email })
    if (!userExist) {
        return next(new AppError("email not exist ", 404))
    }
    if (userExist.forgetCode !== code) {
     return next(new AppError("invalid code ", 400))
    }
    const hash = bcrypt.hashSync(password, +process.env.SALT_ROUND)

    await userModel.updateOne({ email }, { password: hash, forgetCode: "", changePasswordAt: Date.now() })

    res.status(200).json({ MESSAGE: "DONE" })
})
// ************************************logOut*************************************
export const logOut = (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not logout user' });
        }
        res.status(200).json({ message: 'User logged out successfully' });
    });
};