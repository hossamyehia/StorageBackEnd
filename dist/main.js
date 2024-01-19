"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var express_session_1 = __importDefault(require("express-session"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var fs = __importStar(require("fs"));
var main_route_1 = require("./main.route");
var helper_util_1 = require("./shared/util/helper.util");
var configs_config_1 = __importDefault(require("./config/configs.config"));
var passport_config_1 = __importDefault(require("./config/passport.config"));
var passport_middleware_1 = __importDefault(require("./middleware/passport.middleware"));
var app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)({
    origin: "*",
}));
// Logger               
var genName = new Date().toLocaleDateString('en-GB').replace(/\//g, "-");
//new Date().toISOString().split("T")[0];
//new Date().toISOString().replace("T", "&").replace(/\./g, ",").replace(":", "h").replace(":", "m").replace("Z", "s");
var logFile = fs.createWriteStream("./logs/".concat(genName, ".log"), { flags: "a" });
app.use((0, morgan_1.default)("combined", { stream: logFile }));
// Parser
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
// Session
app.use((0, express_session_1.default)({
    secret: configs_config_1.default.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 300000,
    },
}));
// Passport
(0, passport_middleware_1.default)();
app.use(passport_config_1.default.initialize());
app.use(passport_config_1.default.session());
// Routes
app.use(main_route_1.routes);
// ERROR HANDLER
app.use(helper_util_1.errorHandler);
app.listen(configs_config_1.default.PORT, function () {
    console.log("Running on Port ".concat(configs_config_1.default.PORT));
});
