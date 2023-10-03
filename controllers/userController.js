const UserModel = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

const cookieExpires = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: cookieExpires,
  });
};

const getUsers = async (request, response) => {
  try {
    const userLists = await UserModel.find({});
    response.status(200).json(userLists);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
};
const getUser = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await UserModel.findById(id);
    response.status(200).json({ user });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
const addUser = async (request, response) => {
  try {
    const addedUser = await UserModel.create(request.body);
    response.status(200).json(addedUser);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
};
const updateUser = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await UserModel.findByIdAndUpdate(id, request.body, {
      new: true, // To return the updated document
      runValidators: true, // To run validation defined in your schema
    });

    if (!user) {
      return response
        .status(404)
        .json({ message: `Cannot find any user with ID: ${id}` });
    }

    response.status(200).json({ user });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001) {
      // Handle duplicate field error here
      return response.status(400).json({
        message: "Duplicate field value. This value already exists.",
        field: error.keyValue, // The duplicate field and value
      });
    }
    // Other validation or save errors
    response.status(500).json({ message: error.message, status: error.status });
  }
};
const deleteUser = async (request, response) => {
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
};
const login = async (request, response) => {
  try {
    const inputUsername = "admin"; //request.body.username;
    const inputPassword = "admin"; //request.body.password;
    // Check if either username or password is empty
    if (!inputUsername || !inputPassword) {
      return response
        .status(400)
        .json({ message: "Username and Password are required" });
    }
    const user = await UserModel.findOne({
      username: inputUsername,
    });
    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid username/password:User doesn't exists" });
    }
    const passwordMatch = await bcrypt.compare(inputPassword, user.password);
    const url =
      user.position === 1
        ? "/accounts"
        : user.position === 2 || user.position === 3
        ? "/profile"
        : null;

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
          message: "Cookie set successfully",
          redirectUrl: url,
          token: userToken,
        });
    } else {
      response.status(401).json({ message: "Invalid username/password" });
    }
  } catch (error) {
    response.status(500).json({ message: "Server Error: " + error.message });
  }
};
const logout = async (request, response) => {
  try {
    response.clearCookie("Auth_Token");
    response.status(200).json({
      message: "Cookie unset!",
      redirectUrl: `/`,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
const currentUser = async (request, response) => {
  try {
    // Extract the token from the request (assuming it's stored in a cookie)
    const token = request.cookies.Auth_Token;

    if (!token) {
      return response.status(401).json({ message: "No token found" });
    }

    // Verify and decode the JWT token
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return response.status(401).json({ message: "Invalid token" });
      }

      try {
        // Use the decoded payload to fetch user data
        const userId = decoded.id;

        // Query the user data based on the userId
        const user = await UserModel.findOne({ _id: userId });

        if (!user) {
          return response.status(404).json({ message: "User not found" });
        }

        response.status(200).json({
          user: user,
          token: token,
          message: "Current user fetched successfully",
        });
      } catch (error) {
        response.status(500).json({ message: error.message });
      }
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  login,
  logout,
  currentUser,
};
