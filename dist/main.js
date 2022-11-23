"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var express_session_1 = __importDefault(require("express-session"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var index_route_1 = require("./route/index.route");
var helper_util_1 = require("./util/helper.util");
var configs_config_1 = __importDefault(require("./config/configs.config"));
var passport_config_1 = __importDefault(require("./config/passport.config"));
var passport_middleware_1 = __importDefault(require("./middleware/passport.middleware"));
var app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)());
// Logger
app.use((0, morgan_1.default)('combined'));
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
        maxAge: 300000
    }
}));
// Passport
(0, passport_middleware_1.default)();
app.use(passport_config_1.default.initialize());
app.use(passport_config_1.default.session());
// Routes
app.use(index_route_1.routes);
// ERROR HANDLER
app.use(helper_util_1.errorHandler);
app.listen(configs_config_1.default.PORT, function () {
    console.log("Running on Port ".concat(configs_config_1.default.PORT));
});
