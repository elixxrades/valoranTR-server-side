const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../utils/validate");

const BlogPost = require("../model/BlogPost");
const Comment = require("../model/Comment");
const { createPost, createComment, editPost, likePost } = require("../utils/post");

module.exports = class PostsRouter {
  constructor(client) {
    this.client = client;
    this.name = "Posts";
    this.route = "/api/posts";
  }

  run() {
    var { logger } = this.client;

    router.post("/create", isLoggedIn, async (req, res, next) => {
      var { title, content } = req.body
      try {
        if (!(title || content)) return res.error(404, 'All inputs required')

        await createPost({
          owner: req.userData.user_id,
          title: title,
          content: content,
        }).then(x => {
          res.status(200).send(x)
        })

      } catch (err) {
        res.error(500, err.message)
      }
    });

    router.post("/:id/edit", isLoggedIn, async (req, res, next) => {
      var { key, value } = req.body
      var { id } = req.params;
      try {
        if (!(key || value)) return res.error(404, 'All inputs required')

        await editPost({
          ID: id,
          key: key,
          value: value,
        }).then(x => {
          res.status(200).send(x)
        })

      } catch (err) {
        res.error(500, err.message)
      }
    });

    router.post("/:id/comment", isLoggedIn, async (req, res, next) => {
      try {

        var { id } = req.params;
        var { text } = req.body;

        if (!text) return res.error(404, 'All inputs required')

        await createComment({
          owner: req.userData.user_id,
          text: text,
          post: id,
        }).then(x => {
          res.status(200).send(x)
        })

      } catch (err) {
        res.error(500, err.message)
      }
    });

    router.post('/:id/like', isLoggedIn, async (req, res, next) => {
      try {
        return res.error(500, "Currently in maintence")
        var { id } = req.params;
        await likePost({
          userID: req.userData.user_id,
          postID: id,
        }).then(x => {
          res.status(200).send(x)
        })

      } catch (err) {
        res.error(500, err.message)
      }
    })

    return router;
  }
};
