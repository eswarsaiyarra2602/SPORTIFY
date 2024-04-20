const User = require("../models/usersModel")
const {v4:uuidv4}=require("uuid");
const{setUser,getUser} = require("../service/auth")
async function handleUserSignUp(req, res) {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password === cpassword) {
            const signUpUser = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                contactNumber: req.body.contactNumber,
                password: req.body.password,
                cpassword: req.body.cpassword
            });
            const signedup = await signUpUser.save();
            res.status(201).redirect("login");
        } else {
            res.send("<script>alert('Invalid Credentials'); window.location.href = '/api/signup';</script>");
        }
    } catch (err) {
        res.status(400).send(err);
    }
}
async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        const userCredentials = await User.findOne({ email: email });

        if (userCredentials && userCredentials.password === password) {
            // Set a flag indicating user is logged in
            req.userLoggedIn = true;
            const sessionId = uuidv4();
            await setUser(sessionId, userCredentials); // Wait for setUser to complete
            res.cookie("uid", sessionId);
            res.status(201).render("index");
            console.log(req.body.uuidv4);
        } else {
            res.send("<script>alert('Invalid Credentials'); window.location.href = '/api/login';</script>");
        }
    } catch (err) {
        res.status(400).send("Invalid email");
    }
}


module.exports = {
    handleUserLogin,handleUserSignUp
};
