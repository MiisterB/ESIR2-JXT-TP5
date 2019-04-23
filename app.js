const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const usersRouter = require('./routes/users-v1')
const usersModel = require('./model/users')

const useLoggerRouter = require("./routes/auth-v1");
const loggerModel = require("./model/idp");
const logger = loggerModel(usersModel);

const app = express()

let verifyacess = (req, res, next) => 
{
    let token = req.header("Authorization");
    if (token) 
    {
        token = token.replace("bearer ", "");
        logger.verifyacess(token).then((decoded) => 
        {
            next();

        }).catch(()=> 
        {
        res.status(401).json({ message: "Unauthorized" });

        });
    } 
    else 
    {
      res.status(401).json({ message: "Unauthorized" });
    }
};

app.use(bodyParser.json())
app.use(/^(?!.*v1\/auth\/login).*$/, verifyacess);

// Activation de Helmet
app.use(helmet({noSniff: true}))

// On injecte le model dans les routers. Ceci permet de supprimer la dépendance
// directe entre les routers et le modele
app.use('/v1/users', usersRouter(usersModel))
app.use("/v1/auth", useLoggerRouter(usersModel, logger));
// For unit tests
exports.app = app