const BlogPost = require("../model/BlogPost");
const Comment = require("../model/Comment");
const User = require("../model/User");

module.exports.createPost = async function ({ owner, title, content }) {
  return new Promise(async function (resolve, reject) {
    var user = await User.findOne({ _id: owner }).catch(err => reject);;;

    if (!user.postAble) return reject(new Error('You are in timeout. Last Post Date: ' + user.lastPostDate))

    var postdata = new BlogPost({
      owner: user._id,
      title: title,
      content: content,
    })

    postdata.save().catch(err => reject);;

    user.posts.push(postdata)
    user.save().catch(err => reject);

    return resolve(postdata);
  })
};

module.exports.editPost = async function ({ ID, key, value }) {
  new Promise(async function (resolve, reject) {
    try {
      var post = await BlogPost.findById({ _id: ID });
      if (!post) return reject('Post not found');

      post[key] = value;
      post.save();

      resolve(post);
    } catch (error) {
      reject(error);
    }
  })
};

module.exports.createComment = async function ({ owner, text, post }) {
  return new Promise(async (resolve, reject) => {
    var userM = await User.findOne({ _id: owner }).catch(err => reject);
    var postM = await BlogPost.findById(post).catch(err => reject);

    if (typeof postM === 'function') return reject(new Error('Wrong post type')); //  TODO: handle error

    var comment = new Comment({
      owner: userM._id ? userM._id : null,
      post: postM._id ? postM._id : null,
      text: text,
    })
    comment.save().catch(err => reject);;

    postM.comments.push(comment);
    postM.save().catch(err => reject);;

    resolve(comment);
  })
};

module.exports.likePost = async function ({ userID, postID }) {
  new Promise(async function (resolve, reject) {
    try {
      var post = await BlogPost.findById({ _id: postID }).catch(err => reject);
      var userM = await User.findOne({ _id: userID }).catch(err => reject);

      if (!post) return reject('Post not found');
      if (post.likes.find(x => x === userM._id)) {
        post.likes.pull(userM._id)
        post.likeCount -= 1
      } else {
        post.likes.push(userM._id)
        post.likeCount += 1
      }

      post.save();

      resolve(post);
    } catch (error) {
      reject(error);
    }
  })
};
