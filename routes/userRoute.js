const express = require("express");
const router = express.Router();
const { handleUserLogin,handleUserSignUp } = require("../controllers/userController");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get("/signup", (req, res) => {
    res.render("signup");
});
router.post("/signup",handleUserSignUp );

router.get("/login", (req, res) => {
    res.render("login");
});
router.post('/login',handleUserLogin); 


module.exports =router;