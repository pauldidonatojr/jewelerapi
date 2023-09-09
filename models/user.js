const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  }
});

const User = mongoose.model("User", userSchema);

exports.User = User;
