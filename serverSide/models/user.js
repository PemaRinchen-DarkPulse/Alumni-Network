const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
});

// Hash password before saving user
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next(); // Skip if password is unchanged
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
