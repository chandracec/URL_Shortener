const express=require('express');
const bodyPArser = require('body-parser');
const mongoose=require('mongoose'); 

const route=require('./routes/route')

const PORT=4000
const app=express();

app.use(bodyPArser.urlencoded({extended:true}));

app.use(bodyPArser.json());

mongoose.connect('mongodb+srv://kashiProject:l7ZgZgDh0v6JVAGv@cluster0.s9hkgej.mongodb.net/group3Database',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{console.log("mongoDB is connected")})
.catch(error=>console.log(error.message))

app.use("/",route)
app.listen(PORT,()=>{console.log(`listening on ${PORT}`)})