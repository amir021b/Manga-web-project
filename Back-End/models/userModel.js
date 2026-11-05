const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (val) {
          if (!validator.isEmail(val)) return false;

          const commonTypos = [".comm", ".con", ".cmo", ".ocm"];
          if (commonTypos.some((typo) => val.endsWith(typo))) {
            return false;
          }

          return true;
        },
        message:
          "Please provide a valid email address (check for typos like .comm)!",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [6, "Password must be at least 6 characters."],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
