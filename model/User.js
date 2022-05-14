const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
    },
  ],
  token: { type: String },
});

userSchema.methods.lastPostDate = function() {
  if (this.posts.length === 0) return 0;
  return this.posts[this.posts.length - 1].createdAt;
};

userSchema.methods.postAble = function() {
  console.log(this)
  if (this.posts.length === 0) return false;
  if (new Date() - this.posts[this.posts.length - 1].createdAt > 600000)
    return true;
  else return false;
};

module.exports = mongoose.model("User", userSchema);
