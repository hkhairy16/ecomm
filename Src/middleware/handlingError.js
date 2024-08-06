// import { AppError } from "../utilities/AppError.js"




// export const handleError= (fn) =>{
//     return (req,res,next) =>{
//         fn(req,res).catch(err=> next(new AppError(err,401)))
//     }

// }

import { AppError } from "../utilities/AppError.js";

export const handleError = (fn) => {
    // Return a new middleware function
    return (req, res, next) => {
        // Call the provided function and handle promises
        fn(req, res, next).catch((err) => {
            // Ensure next is available and is a function
            if (typeof next === "function") {
                // Pass the error along with a status code to the next error handler
                next(new AppError(err.message || "Server Error", 401));
            } else {
                // If next isn't available, log an error or handle it another way
                console.error("next is not available in handleError middleware.");
            }
        });
    };
};
