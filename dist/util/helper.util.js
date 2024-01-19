"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPhoneValid = exports.isIDValid = exports.isPasswordValid = exports.isUsernameValid = exports.errorHandler = exports.handleResponse = void 0;
var apiResponse_model_1 = __importDefault(require("../model/apiResponse.model"));
/**
 *
 * @param res
 * @param status
 * @param success
 * @param message
 * @param data
 */
function handleResponse(res, status, success, message, data) {
    'use strict';
    if (status === void 0) { status = 200; }
    res.status(status)
        .json(Response({
        success: success,
        message: message,
        data: data,
    }));
}
exports.handleResponse = handleResponse;
var Response = function (payload) {
    if (payload === void 0) { payload = {}; }
    return new apiResponse_model_1.default(payload);
};
function errorHandler(error, req, res, next) {
    handleResponse(res, error.status, false, error.message, []);
}
exports.errorHandler = errorHandler;
;
function isUsernameValid(username) {
    var res = /^[a-z0-9_]+$/.exec(username);
    var valid = !!res;
    return valid;
}
exports.isUsernameValid = isUsernameValid;
function isPasswordValid(password) {
    var res = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.exec(password);
    var valid = !!res;
    return valid;
}
exports.isPasswordValid = isPasswordValid;
function isIDValid(id) {
    if (isNaN(parseFloat(id)))
        return false;
    if (id.length !== 14)
        return false;
    return true;
}
exports.isIDValid = isIDValid;
function isPhoneValid(phone) {
    if (isNaN(parseFloat(phone)))
        return false;
    if (phone.length !== 11)
        return false;
    return true;
}
exports.isPhoneValid = isPhoneValid;
