//define user models
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your fullname"],
      validate: [
        {
          validator: async function (value) {
            // Check uniqueness
            const user = await this.constructor.findOne({ fullName: value });
            return !user;
          },
          message: "This fullname has already been used",
        },
      ],
    },
    contact: {
      type: String,
      required: [true, "Please enter your contact"],
      validate: [
        {
          validator: async function (value) {
            // Check uniqueness
            const user = await this.constructor.findOne({ contact: value });
            return !user;
          },
          message: "This contact number has already been used",
        },
        {
          validator: function (value) {
            // Check maximum length
            return value.length >= 11;
          },
          message: "Contact number must be atleast 11 characters",
        },
      ],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: [
        {
          validator: async function (value) {
            // Check uniqueness
            const user = await this.constructor.findOne({ email: value });
            return !user;
          },
          message: "This email has already been used",
        },
      ],
    },
    username: {
      type: String,
      required: [true, "Please enter your username"],
      validate: [
        {
          validator: async function (value) {
            // Check uniqueness
            const user = await this.constructor.findOne({ username: value });
            return !user;
          },
          message: "This username has already been used",
        },
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    position: {
      type: Number,
      required: [true, "Please select position"],
      // 1 = admin
      // 2 = client
      // 3 = applicant
    },
    applicationStatus: {
      type: Number,
      required: [true, "Please select status"],
      // { value: 1, label: "All users" },
      // { value: 2, label: "Pending" },
      // { value: 3, label: "For review" },
      // { value: 4, label: "Accepted" },
      // { value: 5, label: "Rejected" },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  console.log("user about to be created & saved", this);
  next();
});
userSchema.post("save", function (doc, next) {
  console.log("new user was created & saved", doc);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password, salt);
    // console.log(this.password);
    // next();
    if (this._update.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        this._update.password,
        saltRounds
      );
      this._update.password = hashedPassword;
      next();
    }
  } catch (error) {
    next(error);
  }
});
userSchema.post("findOneAndUpdate", function (doc, next) {
  console.log("user was updated & saved", doc);
  next();
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
