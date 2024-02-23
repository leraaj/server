//define job models
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  message: messageSchema,
});
const messageSchema = new mongoose.Schema({
  author: String,
  text: String,
  file: {
    name: String,
    type: String,
    date: String,
  },
  urlLink: String,
  dateTimePosted: {
    type: Date,
    default: Date.now,
  },
});
conversationSchema.pre("save", async function (next) {
  console.log("conversation about to be created & saved", this);
  next();
});
conversationSchema.post("save", function (doc, next) {
  console.log("new conversation was created & saved", doc);
  next();
});

conversationSchema.pre("findOneAndUpdate", async function (next) {
  try {
    next();
  } catch (error) {
    next(error);
  }
});
conversationSchema.post("findOneAndUpdate", function (doc, next) {
  console.log("conversation was updated & saved", doc);
  next();
});
const ConversationModel = mongoose.model("conversations", conversationSchema);
module.exports = ConversationModel;
