"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInputs = exports.addUser = exports.validate = exports.loginRedirect = exports.loginRequired = exports.login = exports.register = void 0;
var passport_config_1 = __importDefault(require("../config/passport.config"));
var HttpException_model_1 = __importDefault(require("../model/HttpException.model"));
var auth_service_1 = require("../service/auth.service");
var user_service_1 = require("../service/user.service");
var helper_util_1 = require("../util/helper.util");
function register(req, res, next) {
    (0, user_service_1.insertUser)(req.body.username, req.body.password, req.body.name, req.body.type)
        .then(function (user) {
        passport_config_1.default.authenticate("local")(req, res, function () {
            (0, helper_util_1.handleResponse)(res, 201, true, "Register Successfully");
        });
    }).catch(function (err) {
        next(new HttpException_model_1.default(500, err.message));
    });
}
exports.register = register;
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
exports.login = login;
function loginRequired(req, res, next) {
    passport_config_1.default.authenticate('jwt', function (err, user, info) {
        if (!user)
            return next(new HttpException_model_1.default(401, "Please log in"));
        return next();
    })(req, res, next);
}
exports.loginRequired = loginRequired;
function loginRedirect(req, res, next) {
    passport_config_1.default.authenticate('jwt', function (err, user, info) {
        if (user)
            return next(new HttpException_model_1.default(400, "logged in already"));
        return next();
    })(req, res, next);
}
exports.loginRedirect = loginRedirect;
function validate(req, res, next) {
    var username = req.body.username || '';
    if (!(0, helper_util_1.isUsernameValid)(username))
        return next(new HttpException_model_1.default(409, "Invalid Username"));
    var password = req.body.password || '';
    if (!(0, helper_util_1.isPasswordValid)(password))
        return next(new HttpException_model_1.default(409, "Invalid Password"));
    return next();
}
exports.validate = validate;
function addUser(req, res, next) {
}
exports.addUser = addUser;
function validateInputs(req, res, next) {
    var ID = req.body.id || '';
    if (!(0, helper_util_1.isIDValid)(ID))
        return next(new HttpException_model_1.default(409, "invalid ID"));
    var name = req.body.name || '';
    if (name.length <= 0 || name.length >= 46)
        return next(new HttpException_model_1.default(409, "Invalid Name"));
    var Phone = req.body.phone || '';
    if (!(0, helper_util_1.isPhoneValid)(Phone))
        return next(new HttpException_model_1.default(409, "Invalid Phone"));
    var address = req.body.name || '';
    if (address.length <= 0 || address.length >= 46)
        return next(new HttpException_model_1.default(409, "Invalid Address"));
    return next();
}
exports.validateInputs = validateInputs;
exports.default = {
    register: register,
    login: login,
    loginRequired: loginRequired,
    loginRedirect: loginRedirect,
    validate: validate,
    addUser: addUser
};
