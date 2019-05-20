const express = require("express");
const router = express.Router();
const loger = require("../model/idp");
usersModel = undefined;
loggerModel = undefined;

router.post("/login", (req, res, next) => {
  username = req.body.login;
  password = req.body.password;
  if (username && password) {
    loggerModel.login(username, password).then(token => {
      res.status(200).json({ message: "Ok", access_token: token });
    }).catch(() => {
      res.status(401).json({ message: "Unauthorized" });

    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/verifyaccess", (req, res, next) => {
  let token = req.header("Authorization");
  if (token) {
    token = token.replace("bearer ", "");
    const access = loggerModel.verifyacess(token).then((decoded) => {
      res.status(200).json({ message: "Ok" });

    }).catch(()=> {
      res.status(401).json({ message: "Unauthorized" });

    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});
module.exports = (user, logger) => {
  usersModel = user;
  loggerModel = logger;
  return router;
};
