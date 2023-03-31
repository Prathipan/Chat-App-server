const mongoose = require("mongoose");

const userModal = mongoose.Schema(
  {
    userName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    picture: {
      type: String,
      require: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userModal);

