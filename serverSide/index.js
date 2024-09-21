const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const UserModel = require("./models/user");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/alumni-network", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Register route
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    UserModel.findOne({ email })
    .then(existingUser => {
        if (existingUser) {
            return res.json({ success: false, message: "Email already in use" });
        }
        
        // Create new user
        const newUser = new UserModel({ name, email, password });
        newUser.save()
            .then(user => res.json({ success: true, message: "Registration successful", user }))
            .catch(err => res.json({ success: false, message: "Error during registration", error: err }));
    });
});

// Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    // Find the user by email
    UserModel.findOne({ email })
    .then(user => {
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Compare password with hashed password
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (isMatch) {
                res.json({ success: true, message: "Login successful" });
            } else {
                res.json({ success: false, message: "Invalid password" });
            }
        })
        .catch(err => res.json({ success: false, message: "Error during login", error: err }));
    })
    .catch(err => res.json({ success: false, message: "Error during login", error: err }));
});

// Start the server
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
