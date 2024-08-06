
import express from "express"
// import{validation}from"./../user/controller/user.validation.js"
// import {auth} from "../../middleware/auth.js";
import {getAllUsers,getUserById,updateUser,deleteUser,changePassword, signIn, signUp,verifyEmail,forgetPassword,resetPassword,logOut, createUser} from "./controller/user.controller.js";
// import { changePasswordSchema, signUpSchema,signInSchema,updateUserSchema,resetPasswordSchema, forgetPasswordSchema  } from "./controller/user.validation.js";
// import { roles } from "../../utilities/roles.js";
const userRoutes=express.Router();

userRoutes.post("/signup", signUp)
userRoutes.post("/adduser", createUser)
userRoutes.post("/signin",signIn)
userRoutes.patch("/changepassword/:id",changePassword)
userRoutes.get("/getallusers",getAllUsers)
userRoutes.get("/getuserbyid/:id",getUserById)
userRoutes.patch("/updateuser/:id",updateUser)
userRoutes.get("/verify/:token", verifyEmail)
userRoutes.delete( "/deleteuser/:id",deleteUser)
userRoutes.patch("/sendCode",forgetPassword)
userRoutes.patch("/resetPassword",resetPassword)
userRoutes.post("/logout",logOut);

export default userRoutes;
