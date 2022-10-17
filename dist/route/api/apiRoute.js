"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
var express_1 = require("express");
exports.apiRoutes = (0, express_1.Router)();
exports.apiRoutes.route('/').get(function (req, res, next) {
    res.sendStatus(200);
});
