const express = require("express");
const app = express();

const cors = require("cors");
const loadRoutes = require("./utils/loadRoutes");
const bodyParser = require("body-parser");

const LGR = require("@elixxrades/ssp-logger");

const logger = new LGR({
  logPath: process.cwd() + "/logs",
  name: "Blog App Server Side",
});

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require("mongoose");

const {
  MONGO_URI
} = process.env;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Successfully connected to database");
  })
  .catch((error) => {
    logger.debug("database connection failed. exiting now...");
    logger.error(error);
    process.exit(1);
  });


app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(function(req, res, next) {
  var IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  res.error = (code, json) => {
    logger.error('New Error On Request.', {
      URL: ` ${req.protocol}://${req.get('host')}${req.originalUrl}`,
      IP: IP,
      BODY: req.body,
      PARAMS: req.params,
      QUERY: req.query,
      HEADERS: req.headers,
      ERROR: {
        errorCode: code,
        data: json
      }
    })
    return res.status(code).json({
      errorCode: code,
      data: json
    })
  }
  logger.debug(`New request : ${req.protocol}://${req.get('host')}${req.originalUrl}. IP Adress : ${IP}`)

  next()
})

app.listen(3000, async () => {
  logger.info("Server Started On : 3000");
  await loadRoutes(app, {
    logger: logger,
  });
});