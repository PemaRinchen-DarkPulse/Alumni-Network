const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const UserModel = require("./models/user")
const app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/alumni-network")
app.post('/register',(req,res)=>{
    UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
})
app.listen(8080,()=>{
    console.log("server is ruuning")
})