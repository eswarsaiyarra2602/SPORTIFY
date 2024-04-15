const express = require('express');
const { __localsAsData } = require('hbs');
const path = require('path');
require("./db/config");
const User = require("./models/users");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");


// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    // Check if user is logged in
    if (req.userLoggedIn) {
        // If logged in, proceed to the next middleware/route handler
        next();
    } else {
        // If not logged in, redirect to login page or send an error
        res.redirect("/login"); // Redirect to login page
        // Alternatively, you can send a 401 Unauthorized status
        // res.status(401).send("Unauthorized");
    }
};

app.get("/", (req, res) => {
    res.redirect("login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
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
            })
            const signedup = await signUpUser.save();
            res.status(201).redirect("login");
        } else {
            res.send("<script>alert('Invalid Credentials'); window.location.href = '/signup';</script>");
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userCredentials = await User.findOne({ email: email });
        if (userCredentials.password === password) {
            // Set a flag indicating user is logged in
            req.userLoggedIn = true;
            res.status(201).render("index");
        } else {
            res.send("<script>alert('Invalid Credentials'); window.location.href = '/login';</script>");
        }
    } catch (err) {
        res.status(400).send("Invalid email");
    }
});

app.get("/badminton_products", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/badminton_products.html'));
});
app.listen(port, () => {
    console.log(`Server started at port no ${port}`);
});
