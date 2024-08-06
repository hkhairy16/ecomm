import joi from "joi"


// *************************************signUp*********************************************
export const signUpSchema ={ body:joi.object(
    {
    name: joi.string().trim().required(),
    email: joi.string().email().required(),
    password: joi.string().required(), 
    confirmPassword:joi.valid(joi.ref('password')).required(), 
    phone:joi.string().regex(/^01[0125][0-9]{8}$/).required(),
    role:joi.string().valid("User", "admin")
    }).required()
}
// *************************************signIn*********************************************
export const signInSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(), 
    
    }).required()
}
// *************************************updateUser*********************************************
export const updateUserSchema =  joi.object({
    id:joi.string().hex().length(24).required(),
        name: joi.string().min(2).max(15).alphanum().optional(),
        email:  joi.string().email().optional(),
        password: joi.string().optional, 
        phone: joi.string().regex(/^01[0125][0-9]{8}$/).optional(),
    })



// *************************************changePassword*********************************************
export const changePasswordSchema = {
    body: joi.object({
        newPassword: joi.string().required(), 
    }).required(),

}
// *************************************forgetPassword*********************************************
export const forgetPasswordSchema = {
    body: joi.object().keys({
        email: joi.string().email().required(),
    }).required()
}
// *************************************resetPassword*********************************************
export const resetPasswordSchema = {
    body: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required(), 
        code: joi.string().required(),
        password: joi.string().required(), 
    confirmPassword:joi.valid(joi.ref('password')).required(), 
    }).required()
}