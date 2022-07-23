const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Product = require("../models/Product");

const router = require("express").Router();

//Atualizar Produto
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new:true});
        res.status(200).json(updatedProduct);
    }catch(err){
        res.status(500).json(err)
    }
})

//Deletar Produto
router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Produto apagado")
    }catch(err){
        res.status(500).json(err)
    }
})

//Pegar Produto
router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const user = await Product.findById(req.params.id)
        const { password, ...others } = product._doc
        res.status(200).json(others)
    }catch(err){
        res.status(500).json(err)
    }
})

//Mostrar Todos os Produtos
router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    const query = req.query.new
    try{
        const users = query 
        ? await Product.find().sort({ _id: -1 }).limit(5) 
        : await Product.find()
        res.status(200).json(users)
    }catch(err){
        res.status(500).json(err)
    }
})

//Mostrar Produtos pelo mês
router.get("/stats", verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await Product.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum:1}
                }
            }
        ])
        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router