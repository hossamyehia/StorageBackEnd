"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiResponse = /** @class */ (function () {
    function ApiResponse(_a) {
        var _b = _a.success, success = _b === void 0 ? true : _b, _c = _a.message, message = _c === void 0 ? 'Ok' : _c, _d = _a.data, data = _d === void 0 ? [] : _d;
        this.Data = data;
        this.Success = success;
        this.Message = message;
    }
    Object.defineProperty(ApiResponse.prototype, "data", {
        get: function () {
            return this.Data;
        },
        set: function (data) {
            this.Data = data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiResponse.prototype, "success", {
        get: function () {
            return this.Success;
        },
        set: function (success) {
            this.Success = success;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiResponse.prototype, "message", {
        get: function () {
            return this.Message;
        },
        set: function (message) {
            this.Message = message;
        },
        enumerable: false,
        configurable: true
    });
    ApiResponse.prototype.toJSON = function () {
        return {
            Success: this.Success,
            Message: this.message,
            Data: this.data,
        };
    };
    return ApiResponse;
}());
exports.default = ApiResponse;
