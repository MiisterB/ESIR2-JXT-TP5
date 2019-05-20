const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt_round = 10;
fs = require("fs");
const secret = fs.readFileSync("jwtRS256.key");
users = undefined;

const get_hash = username => {
  hash = users.getAll().filter(value => {
    return value.login === username;
  });
  if (hash.length > 0) {
    return hash[0].password;
  } else {
    return undefined;
  }
};

const login = (username, password) => {
  return new Promise((resolve, reject) => {
    hash = get_hash(username);
    if (!hash) {
      reject();
    } else {
      bcrypt
        .compare(password, hash)
        .then(compare => {
          if (compare) {
            token = jwt.sign(username, secret, (err, token) => {
              if (err) {
                reject();
              } else {
                resolve(token);
              }
            });
          } else {
            reject();
          }
        })
        .catch(() => reject());
    }
  });
};

const verifyacess = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject();
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = model => {
  users = model;
  return { login, verifyacess };
};
