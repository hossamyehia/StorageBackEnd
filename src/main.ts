require("dotenv").config();
import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import * as fs from "fs";

import { routes } from "./main.route";
import { errorHandler } from "./shared/util/helper.util";
import configs from "./config/configs.config";
import passport from "./config/passport.config";
import initPassport from "./middleware/passport.middleware";

const app = express();

// CORS
app.use(
  cors({
    origin: "*",
  })
);

// Logger               
const genName = new Date().toLocaleDateString('en-GB').replace(/\//g, "-");
//new Date().toISOString().split("T")[0];
//new Date().toISOString().replace("T", "&").replace(/\./g, ",").replace(":", "h").replace(":", "m").replace("Z", "s");
var logFile = fs.createWriteStream(`./logs/${genName}.log`, { flags: "a" });
app.use(logger("combined", { stream: logFile }));

// Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Session
app.use(
  session({
    secret: configs.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 300000,
    },
  })
);

// Passport
initPassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(routes);

// ERROR HANDLER
app.use(errorHandler);

app.listen(configs.PORT, () => {
  console.log(`Running on Port ${configs.PORT}`);
});
