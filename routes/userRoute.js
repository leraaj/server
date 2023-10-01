const express = require("express");
const router = express.Router();
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

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.post("/user", addUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.post("/user/login", login);
router.post("/user/logout", logout);
router.post("/user/current-user", currentUser);

module.exports = router;
