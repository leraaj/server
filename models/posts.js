//define job models
const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Number, required: [true, "Please select category"] },
    //Category:
    // 1 = service
    // 2 = position
    // 3 = person
    // 4 = project
    image_name: { type: String, required: true },
    media_file: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
postSchema.pre("save", async function (next) {
  console.log("posts about to be created & saved", this);
  next();
});
postSchema.post("save", function (doc, next) {
  console.log("new posts was created & saved", doc);
  next();
});
postSchema.pre("findOneAndUpdate", async function (next) {
  try {
    next();
  } catch (error) {
    next(error);
  }
});
postSchema.post("findOneAndUpdate", function (doc, next) {
  console.log("posts was updated & saved", doc);
  next();
});
const PostModel = mongoose.model("posts", postSchema);
module.exports = PostModel;
