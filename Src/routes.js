import userRoutes from "./modules/user/user.routes.js"




export const allRoutes = (app)=>{
    app.use(userRoutes)
}