const { model, Schema } = require("mongoose");

//Schema for how the users must be created
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

module.exports = model("User", userSchema);
