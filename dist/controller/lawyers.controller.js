"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_config_1 = __importDefault(require("../config/passport.config"));
var HttpException_model_1 = __importDefault(require("../model/HttpException.model"));
var auth_service_1 = require("../service/auth.service");
var lawyer_service_1 = require("../service/lawyer.service");
var helper_util_1 = require("../util/helper.util");
function register(req, res, next) {
    (0, lawyer_service_1.insertUser)(req.body.username, req.body.password, req.body.name)
        .then(function (user) {
        passport_config_1.default.authenticate("local")(req, res, function () {
            (0, helper_util_1.handleResponse)(res, 201, true, "Register Successfully");
        });
    }).catch(function (err) {
        next(new HttpException_model_1.default(500, err.message));
    });
}
function login(req, res, next) {
    passport_config_1.default.authenticate('local', function (err, user, info) {
        if (err)
            return next(new HttpException_model_1.default(500, 'Server Error'));
        if (!user)
            return next(new HttpException_model_1.default(404, 'User Not Found'));
        var token = (0, auth_service_1.getToken)(user);
        req.login(user, function (err) {
            if (err) {
                return next(new HttpException_model_1.default(500, err.message));
            }
            (0, helper_util_1.handleResponse)(res, 200, true, 'Login Successfully', [{ token: token }]);
        });
    })(req, res, next);
}
function loginRequired(req, res, next) {
    passport_config_1.default.authenticate('jwt', function (err, user, info) {
        if (!user)
            return next(new HttpException_model_1.default(401, "Please log in"));
        return next();
    })(req, res, next);
}
function loginRedirect(req, res, next) {
    passport_config_1.default.authenticate('jwt', function (err, user, info) {
        if (user)
            return next(new HttpException_model_1.default(400, "You are already logged in"));
        return next();
    })(req, res, next);
}
/** Helper Functions */
function validate(req, res, next) {
    var username = req.body.username || '';
    if (!(0, helper_util_1.isUsernameValid)(username))
        return next(new HttpException_model_1.default(409, "Username is invalid"));
    var password = req.body.password || '';
    if (!(0, helper_util_1.isPasswordValid)(password))
        return next(new HttpException_model_1.default(409, "Password is invalid"));
    next();
}
exports.default = {
    register: register,
    login: login,
    loginRequired: loginRequired,
    loginRedirect: loginRedirect,
    validate: validate,
};
