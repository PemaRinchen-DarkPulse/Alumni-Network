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

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
