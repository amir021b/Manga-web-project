const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      trim: true,
      minlength: [4, "Username must be at least 4 characters."],
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
      minlength: [8, "Password must be at least 8 characters."],
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    settings: {
      theme: {
        type: String,
        enum: ["dark", "light"],
        default: "dark",
      },
      accentColor: {
        type: String,
        enum: ["red", "purple", "blue"],
        default: "red",
      },
      density: {
        type: String,
        enum: ["comfortable", "compact"],
        default: "comfortable",
      },
    },
    backpack: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
