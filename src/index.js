const express=require('express');
const bodyPArser = require('body-parser');
const mongoose=require('mongoose'); 

const route=require('./route/routes')

const PORT=3000
const app=express();

app.use(bodyPArser.urlencoded({extended:true}));

app.use(bodyPArser.json());

mongoose.connect('mongodb+srv://saurabhdigambar8:X1UED3V4eKh2u9M4@cluster0.tlt0rzr.mongodb.net/group3Database',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{console.log("mongoDB is connected")})
.catch(error=>console.log(error.message))

app.use("/",route)
app.listen(PORT,()=>{console.log(`listening on ${PORT}`)})