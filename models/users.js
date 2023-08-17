//define user models
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, "Please enter fullname"] },
    contact: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: [true, "please enter password"],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  console.log("user about to be  created & saved", this);
  next();
});
userSchema.post("save", function (doc, next) {
  console.log("new user was created & saved", doc);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const salt = await bcrypt.genSalt();
  const update = this.getUpdate();
  if (update.password) {
    const passwordHash = await bcrypt.hash(update.password, salt);
    this.setUpdate({
      $set: {
        password: passwordHash,
      },
    });
  }
  next();
});
userSchema.post("findOneAndUpdate", function (doc, next) {
  console.log("user was updated & saved", doc);
  next();
});
//identifier <variableName> = mongoose.model('<collectionName>', <variableSchema>)
const UserModel = mongoose.model("users", userSchema);

// module.exports = <variableName>

module.exports = UserModel;
//Export the User varliable to be use on index.js
