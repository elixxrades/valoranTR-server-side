const express = require("express");
const router = express.Router();

const packagej = require("../package.json");
const { isLoggedIn } = require("../utils/validate");

module.exports = class DocsRouter {
  constructor(client) {
    this.client = client;
    this.name = "Docs";
    this.route = "/docs";
  }

  run() {
    router.get("/", isLoggedIn, (req, res, next) => {
      res.status(200).json({
        version: packagej.version,
        author: packagej.author,
        license: packagej.license,
      });
    });

    return router;
  }
};