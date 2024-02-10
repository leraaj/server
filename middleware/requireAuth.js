const jwt = require("jsonwebtoken");
const UserModel = require("../models/users");

const requireAuth = async (request, response, next) => {
  const token = request.cookies.Auth_Token;
  if (!token) {
    return response.status(401).json({ error: "Authorization token required" });
  }
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    request.user = await UserModel.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    return response.status(401).json({ error: "Request is not authorized" });
  }

  // console.log(token);
};

module.exports = requireAuth;
