const express = require("express");
const router = express.Router();
const {
  getPost,
  getPosts,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.get("/posts", getPosts);
router.get("/post/:id", getPost);
router.post("/post", addPost);
router.put("/post/:id", updatePost);
router.delete("/post/:id", deletePost);

module.exports = router;
