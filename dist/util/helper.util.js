"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.handleResponse = void 0;
var Response = function (payload) {
    if (payload === void 0) { payload = {}; }
    var ApiResponse = /** @class */ (function () {
        function ApiResponse(_a) {
            var _b = _a.data, data = _b === void 0 ? [] : _b, _c = _a.status, status = _c === void 0 ? 1 : _c, _d = _a.errors, errors = _d === void 0 ? [] : _d, _e = _a.message, message = _e === void 0 ? '' : _e;
            this.Data = data;
            this.Status = status;
            this.Errors = errors;
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
        Object.defineProperty(ApiResponse.prototype, "status", {
            get: function () {
                return this.Status;
            },
            set: function (status) {
                this.Status = status;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ApiResponse.prototype, "errors", {
            get: function () {
                return this.Errors;
            },
            set: function (errors) {
                this.Errors = errors;
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
                status: this.status,
                message: this.message,
                data: this.data,
                errors: this.errors.map(function (e) { return e.message ? e.message : e; }),
            };
        };
        return ApiResponse;
    }());
    return new ApiResponse(payload);
};
function handleResponse(res, status, message, data, errors) {
    'use strict';
    if (status === void 0) { status = 200; }
    res.status(status)
        .json(Response({
        status: status,
        message: message,
        data: data,
        errors: errors,
    }));
}
exports.handleResponse = handleResponse;
var errorHandler = function (err, req, res, next) {
    handleResponse(res, 500, "ERROR", [], [err]);
};
exports.errorHandler = errorHandler;
