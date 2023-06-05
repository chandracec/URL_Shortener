const express = require("express");
const { default: mongoose } = require("mongoose");
const route = require("../src/route/routes.js");

require('dotenv').config();

const {MONGODB_CONNECT} = process.env

const app = express();

app.use(express.json());

mongoose
  .connect(
    MONGODB_CONNECT,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("Error while connecting to the database:", error.message);
  });

app.use("/", route);

app.listen(3000, () => {
  console.log(`app running on 3000`);
});
