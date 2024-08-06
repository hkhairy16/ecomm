
import mongoose from 'mongoose'

export const dbConnection = () =>{
    mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then( () => console.log("DB Connected"))
    .catch( (err) => console.log("DB Failed", err));
}