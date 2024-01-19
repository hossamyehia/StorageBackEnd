"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var passport_local_1 = require("passport-local");
var passport_jwt_1 = require("passport-jwt");
var auth_service_1 = require("../shared/services/auth.service");
var user_service_1 = require("../User/user.service");
var options = {
    usernameField: 'username',
    passwordField: 'password'
};
var opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
};
passport_1.default.use('local', new passport_local_1.Strategy(options, function verify(username, password, done) {
    (0, user_service_1.findByUsername)(username)
        .then(function (user) {
        if (!user)
            return done(null, false, { message: 'User Not Found.' });
        if (!(0, auth_service_1.comparePass)(password, user.password)) {
            return done(null, false, { message: 'Incorrect Password.' });
        }
        else {
            var id = user.id, name_1 = user.name, title = user.title, permission = user.permission;
            return done(null, { id: id, name: name_1, title: title, permission: permission });
        }
    })
        .catch(function (err) { return done(err); });
}));
passport_1.default.use("jwt", new passport_jwt_1.Strategy(opts, function (jwt_payload, done) {
    (0, user_service_1.findById)(jwt_payload.id)
        .then(function (user) {
        if (user)
            return done(null, user);
        else
            return done(null, false);
    })
        .catch(function (err) { return done(err, false); });
}));
exports.default = passport_1.default;
