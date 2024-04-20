const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    wishlist: [String],
    cart: [String]
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
// Routes
app.get('/',(req,res)=>{
    res.redirect("login");
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.post("/signup", async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            wishlist: [],
            cart: []
        });
        await newUser.save();
        // Send alert
        res.send('<script>alert("User registered successfully"); window.location.href="/";</script>');
    } catch (error) {
        // Send alert
        res.send('<script>alert("Failed to register user"); window.location.href="/signup";</script>');
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            // Send alert for successful login
            res.send('<script>alert("Login successful"); window.location.href="/dashboard";</script>');
        } else {
            // Send alert for invalid username or password
            res.send('<script>alert("Invalid username or password"); window.location.href="/login";</script>');
        }
    } catch (error) {
        // Send alert for login failure
        res.send('<script>alert("Login failed"); window.location.href="/login";</script>');
    }
});


app.get("/user/:userID", async (req, res) => {
    const userID = req.params.userID;
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
app.post("/add-to-cart", async (req, res) => {
    const { userID, itemID } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userID, { $push: { cart: itemID } }, { new: true });
        if (user) {
            res.status(200).json({ message: "Item added to cart successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Failed to add item to cart" });
    }
});

app.post("/add-to-wishlist", async (req, res) => {
    const { userID, itemID } = req.body;
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.wishlist.includes(itemID)) {
            return res.status(400).json({ message: "Item is already present in wishlist" });
        }

        user.wishlist.push(itemID);
        await user.save();

        res.status(200).json({ message: "Item added to wishlist successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Remove item from cart
app.post("/remove-from-cart", async (req, res) => {
    const { userID, itemID } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userID, { $pull: { cart: itemID } }, { new: true });
        if (user) {
            res.status(200).json({ message: "Item removed from cart successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Failed to remove item from cart" });
    }
});

// Remove item from wishlist
app.post("/remove-from-wishlist", async (req, res) => {
    const { userID, itemID } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userID, { $pull: { wishlist: itemID } }, { new: true });
        if (user) {
            res.status(200).json({ message: "Item removed from wishlist successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Failed to remove item from wishlist" });
    }
});
app.post("/update-profile", async (req, res) => {
    const { userID, username, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(userID, { username, email }, { new: true });
        if (updatedUser) {
            res.status(200).json({ message: "User profile updated successfully", user: updatedUser });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});



// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
