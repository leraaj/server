const PostModel = require("../models/posts");

const getPosts = async (request, response) => {
  try {
    const postsLists = await PostModel.find({});
    response.status(200).json(postsLists);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
};
const getPost = async (request, response) => {
  try {
    const { id } = request.params;
    const post = await PostModel.findById(id);
    response.status(200).json({ post });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
const addPost = async (request, response) => {
  try {
    const addedPost = await PostModel.create(request.body);
    response.status(200).json(addedPost);
  } catch (error) {
    console.log(error.message);
    response.status(500).json({ message: error.message });
  }
};
const updatePost = async (request, response) => {
  try {
    const { id } = request.params;
    const post = await PostModel.findByIdAndUpdate(id, request.body, {
      new: true, // To return the updated document
      runValidators: true, // To run validation defined in your schema
    });

    if (!post) {
      return response
        .status(404)
        .json({ message: `Cannot find any post with ID: ${id}` });
    }

    response.status(200).json({ post });
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
const deletePost = async (request, response) => {
  try {
    const { id } = request.params;
    const post = await PostModel.findByIdAndDelete(id);
    if (!post) {
      return response
        .status(404)
        .json({ message: `cannot find any post with an ID ${id}` });
    }
    response.status(200).json(post);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
module.exports = {
  getPost,
  getPosts,
  addPost,
  updatePost,
  deletePost,
};
