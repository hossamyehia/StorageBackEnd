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
var index_route_1 = require("./route/index.route");
var helper_util_1 = require("./util/helper.util");
var app = (0, express_1.default)();
var PORT = process.env.PORT;
var secret = process.env.SECRET || 'abv6as-d5gbsa-46dsd9';
// CORS
app.use((0, cors_1.default)());
// Logger
app.use((0, morgan_1.default)('combined'));
// Parser
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// Session
app.use((0, express_session_1.default)({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));
// Routes
app.use(index_route_1.routes);
// ERROR HANDLER
app.use(helper_util_1.errorHandler);
app.listen(PORT, function () {
    console.log("Running on Port ".concat(PORT));
});
