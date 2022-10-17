"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var body_parser_1 = __importDefault(require("body-parser"));
var route_1 = require("./route");
var app = (0, express_1.default)();
var PORT = process.env.PORT;
// Logger
app.use((0, morgan_1.default)('combined'));
// Parser
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(route_1.routes);
app.listen(PORT, function () {
    console.log("Running on Port ".concat(PORT));
});
