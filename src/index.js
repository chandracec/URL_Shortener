const express = require("express");
const { default: mongoose } = require("mongoose");
const route = require("../src/route/routes.js");

mongoose.set("strictQuery", true);
const app = express();

app.use(express.json());

 mongoose.connect(
      "mongodb+srv://saurabhdigambar8:X1UED3V4eKh2u9M4@cluster0.tlt0rzr.mongodb.net/group3Database",
      { useNewUrlParser: true }
    );
    console.log("database connected");

app.use("/", route);

app.listen(3000, () => {
  console.log(`app start on 3000`);
});
