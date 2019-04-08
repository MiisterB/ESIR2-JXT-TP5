// Bcrypt for the password
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function createSalt(sround) {
    const sv = await new Promise((resolve, reject) => {
        bcrypt.genSalt(sround, function(err, salt) {
        if (err) reject(err)
        resolve(salt)
        });
    })

    return sv
}
let saltsave = undefined
saltsave = createSalt(saltRounds).then((param) => {saltsave = param})

async function hash(password) {
  
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltsave, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
  
    return hashedPassword
}

async function compare(hash, pass) {
  
    const isSame = await new Promise((resolve, reject) => {
      bcrypt.compare(pass, hash, function(err, res) {
        if (err) reject(err)
        resolve(res)
      });
    })
  
    return isSame
}

exports.hash = hash
exports.compare = compare
