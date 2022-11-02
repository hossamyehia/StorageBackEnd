"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
var express_1 = require("express");
var api_route_1 = __importDefault(require("./api/api.route"));
exports.routes = (0, express_1.Router)();
// middleware that is specific to this router
exports.routes.use(function (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
exports.routes.route('/').get(function (req, res, next) {
    res.sendStatus(200);
});
exports.routes.use('/api', api_route_1.default);
