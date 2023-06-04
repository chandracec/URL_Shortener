const express = require("express");
const { default: mongoose } = require("mongoose");
const route = require("../src/route/routes.js");

const app = express();

app.use(express.json());

mongoose.connect(
  'mongodb+srv://saurabhdigambar8:X1UED3V4eKh2u9M4@cluster0.tlt0rzr.mongodb.net/group3Database',
  { useNewUrlParser: true }
)
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch((error) => {
    console.log('Error while connecting to the database:', error.message);
  });


app.use("/", route);

app.listen(3000, () => {
  console.log(`app running on 3000`);
});
