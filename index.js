const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
// Routes
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
// ENV
const BASE = process.env.BASE_URL;
const RENDER = process.env.RENDER_URL;
const NETLIFY = process.env.NETLIFY_URL;
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;

// Enable CORS for specific origins (e.g., your Netlify site)
const allowedOrigins = [RENDER, BASE, NETLIFY];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Enable credentials (cookies)
};

app.use(cors(corsOptions));

// app.use(cors({ credentials: true, origin: [BASE, RENDER] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
app.use("/api", userRoute);
app.use("/api", postRoute);

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
