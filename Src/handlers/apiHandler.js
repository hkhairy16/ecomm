



export const deleteOne = (model) => {
    return catchError (async (req,res)=>{
        let deletedBrand = await model.findByIdAndDelete(req.params.id)
        if(deletedBrand){
            res.json({message: "Deleted Successfully", deletedBrand})
        }else{
            res.json({message: "Brand Not Founded"})
        }
    })
}