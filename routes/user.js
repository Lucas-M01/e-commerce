const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const User = require("../models/User");

const router = require("express").Router();

//Updated
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err)
    }
})

//Deletar
router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Usuário apagado")
    }catch(err){
        res.status(500).json(err)
    }
})

//Pegar Usuário
router.get("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        res.status(200).json("Usuário apagado")
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router