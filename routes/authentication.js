const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

module.exports = class AuthRouter {
  constructor(client) {
    this.client = client;
    this.name = "Authentication";
    this.route = "/api/auth";
    this.once = false;
  }

  run() {
    const { logger } = this.client;

    router.post("/register", async (req, res, next) => {
      var { username, name, mail, password } = req.body;
      if (!(username && name && mail && password))
        return res.status(400).send("All input is required");

      var oldUser =
        (await User.findOne({
          mail: mail,
        })) ||
        (await User.findOne({
          username: username,
        }));

      if (oldUser)
        return res.status(409).send("User Already Exist. Please Login");

      var encryptedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username: username.toLowerCase(),
        name,
        mail: mail.toLowerCase(),
        password: encryptedPassword,
        posts: [],
      });

      const token = jwt.sign(
        { user_id: user._id, mail, username },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;

      res.status(201).json(user);
    });

    router.post("/login", async (req, res, next) => {
      const { mail, username, password } = req.body;
      if (!password) {
        res.status(400).send("All input is required");
      }

      if (!username || !mail) {
        res.status(400).send("All input is required");
      }

      var user;

      if (mail) {
        user = await User.findOne({ mail: mail });
      } else if (username) {
        user = await User.findOne({ username: username });
      }

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user._id, mail, username },
          process.env.SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );

        user.token = token;
        res.status(200).json(user);
      } else {
        res.status(400).send("Bad Request");
      }
    });


    return router;
  }
};
