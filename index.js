
import express from 'express'
import { dbConnection } from './DB/connection.js';
import { allRoutes } from './Src/routes.js';


const app = express()
const port = 3000


app.use(express.json());
dbConnection()
allRoutes(app)

app.use("*", (req,res,next)=>{
    next(new AppError("URL not found", 404))
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.statusCode).json({message: err.message, stack: err.stack})
  })


app.get('/', (req,res)=> res.send ("Hello"))
app.listen(port, ()=>console.log( `App listening on port ${port}! `))