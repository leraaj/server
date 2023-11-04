const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();

// gdrive
const { google } = require("googleapis");
const multer = require("multer");
const pth = require("path");
const fs = require("fs");

// Routes
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
// ENV
const BASE = process.env.BASE_URL;
const RENDER = process.env.RENDER_URL;
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;

app.use(cors({ credentials: true, origin: [BASE, RENDER, "3002"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
app.use("/api", userRoute);
app.use("/api", postRoute);

// Experiment

const storage = multer.diskStorage({
  destination: "uploads",
  filename: function (req, file, callback) {
    const extension = file.originalname.split(".").pop();
    callback(null, `${file.fieldname}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

// Experiment
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running...");
    });
    console.log("Connected to DB =>");
  })
  .catch((err) => {
    console.log(err);
  });
