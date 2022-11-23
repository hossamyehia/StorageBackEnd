"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.comparePass = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var configs_config_1 = __importDefault(require("../config/configs.config"));
function comparePass(userPassword, databasePassword) {
    return bcryptjs_1.default.compareSync(userPassword, databasePassword);
}
exports.comparePass = comparePass;
function getToken(user) {
    return jsonwebtoken_1.default.sign(user, configs_config_1.default.SECRET, { expiresIn: 60 * 60 * 8 });
}
exports.getToken = getToken;
;
