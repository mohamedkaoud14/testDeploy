var UserModel = require("../models/userModel.js")
const isAdmin = async function(req, res,next) {
    try{
        const user = UserModel.findOne({_id:req._id,role:'admin'}).lean()
        .exec() 
        if(user)
        {
            next()
        }
        else {
            res.status(401).json({errors:{label:{message:"You are not admin"}}})

        }

        console.log(user)
    }
    catch(e) {
        res.status(401).json({errors:{label:{message:"You are not admin"}}})
    }
    
};

module.exports = {
    isAdmin,
}