const express = require("express");
const router = express.Router();

const BlogPost = require("../model/BlogPost");
const Comment = require("../model/Comment");

module.exports = class IndexRouter {
  constructor(client) {
    this.client = client;
    this.name = "Index";
    this.route = "/";
  }

  run() {
    router.get('/error', function (req, res) {
      res.error(404, 'error example')
    })

    /* router.get("/", (req, res, next) => {
       var post = new BlogPost({
         owner: "6276850094f6f986acfd53f3",
         title: "BUM",
         content: "selam content hiyır",
         comments: [],
       });
       post.save();
 
       var comment = new Comment({
         text: "Comment Text",
         post: post._id,
         owner: "6276850094f6f986acfd53f3",
       });
       comment.save();
 
       post.comments.push(comment);
 
       return res.status(200).send(post);
     });
 */
    return router;
  }
};
