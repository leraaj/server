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
// router.post(requireAuth);
router.get("/users", getUsers);
router.post("/user", addUser);
router.delete("/user/:id", deleteUser);
router.get("/user/:id", getUser);
router.put("/user/:id", updateUser);
// The following requires a TOKEN for security purposes
// router.use(requireAuth);

module.exports = router;
