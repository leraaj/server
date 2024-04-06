const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
// ENV
const BASE = process.env.BASE_URL;
const RENDER = process.env.RENDER_URL;
const MONGO_URL = process.env.MONGO_URL;
const APP = process.env.APP_URL;
const PORT = process.env.PORT;
//
app.use(cors({ credentials: true, origin: [BASE, RENDER, APP] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
app.use("/api", userRoute);
app.use("/api", postRoute);
//
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
    console.log("Connected to DB =>");
  })
  .catch((err) => {
    console.log(err);
  });
