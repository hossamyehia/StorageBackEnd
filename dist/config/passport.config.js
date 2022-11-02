"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = require("passport-local");
var database_1 = require("../config/database");
var auth_service_1 = __importDefault(require("../service/auth.service"));
var passport_middleware_1 = __importDefault(require("../middleware/passport.middleware"));
var options = {
    usernameField: 'username',
    passwordField: 'password'
};
// Init Passport Middleware
(0, passport_middleware_1.default)();
passport_1.default.use(new passport_local_1.Strategy(options, function verify(username, password, done) {
    (0, database_1.db)('lawyers').where({ username: username }).first()
        .then(function (user) {
        if (!user)
            return done(null, false);
        if (!auth_service_1.default.comparePass(password, user.password)) {
            return done(null, false);
        }
        else {
            var id = user.id;
            return done(null, { _id: id });
        }
    })
        .catch(function (err) { return done(err); });
}));
exports.default = passport_1.default;
