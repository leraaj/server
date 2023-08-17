const mongoose = require("mongoose");
const UserModel = require("./models/users");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const BASE_URL = "http://localhost:3000";
app.use(cors({ credentials: true, origin: [BASE_URL] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const cookieExpires = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "cookie", {
    expiresIn: cookieExpires,
  });
};
app.get("/api/users", async (request, response) => {
  try {
    const user = await UserModel.find({});
    response.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).json("{ message: error.message }");
  }
});

app.post("/api/user", async (request, response) => {
  try {
    const user = await UserModel.create(request.body);
    response.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
});
app.get("/api/user/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const user = await UserModel.findById(id);
    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.put("/api/user/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const user = await UserModel.findByIdAndUpdate(id, request.body);

    if (!user) {
      return response
        .status(404)
        .json({ message: `cannot find any product with ID: ${id}` });
    }
    const userUpdatedData = await UserModel.findById(id);
    response.status(200).json(userUpdatedData);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.delete("/api/user/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return response
        .status(404)
        .json({ message: `cannot find any product  with ID ${id}` });
    }
    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post("/api/user/login", async (request, response) => {
  try {
    const user = await UserModel.findOne({
      username: request.body.username,
    });

    if (!user) {
      return response.status(401).json({ message: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(
      request.body.password,
      user.password
    );

    if (passwordMatch) {
      var userToken = createToken(user.id);
      response
        .cookie("Auth_Token", userToken, {
          httpOnly: true,
          maxAge: cookieExpires,
        })
        .status(200)
        .json({
          user: user,
          message: "Cookie set!",
          redirectUrl: `/admin/accounts`,
        });
    } else {
      response.status(401).json({ message: "Invalid login credentials." });
    }
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post("/api/user/logout", async (request, response) => {
  try {
    response.cookie("JWT_authorized", { maxAge: 1 });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post("/api/user/current-user", async (request, response) => {
  try {
    const decoded = jwt.decode(userToken);
    const user = await UserModel.findOne({ _id: decoded.id });
    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.listen(3001, () => {
  console.log("server is running");
});
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://root:HjWuslR6enxkt6Fr@darkshots.ujornr5.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
