const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  login,
  logout,
  currentUser,
} = require("../controllers/userController");
// Login/Logout takes precedence to set a TOKEN either with value or null
router.post("/user/login", login);
router.post("/user/logout", logout);
router.post("/user/current-user", currentUser);
router.get("/users", getUsers);
// The following requires a TOKEN for security purposes
router.use(requireAuth);
router.get("/user/:id", getUser);
router.post("/user", addUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports = router;
