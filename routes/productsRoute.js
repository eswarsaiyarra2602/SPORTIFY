const express = require("express");
const { restrictToLoggedInUserOnly } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/products/badminton-products",restrictToLoggedInUserOnly,(req,res)=>{
    return res.render("badminton_products");
})

module.exports = router;