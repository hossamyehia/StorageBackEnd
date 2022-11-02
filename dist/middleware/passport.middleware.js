"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var database_1 = require("../config/database");
exports.default = (function () {
    passport_1.default.serializeUser(function (user, done) {
        done(null, user._id);
    });
    passport_1.default.deserializeUser(function (id, done) {
        (0, database_1.db)('lawyers').where({ id: id }).first()
            .then(function (user) { done(null, user); })
            .catch(function (err) { done(err, null); });
    });
});
