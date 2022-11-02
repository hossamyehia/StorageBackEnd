"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var bcryptjs_1 = __importDefault(require("bcryptjs"));
function comparePass(userPassword, databasePassword) {
    return bcryptjs_1.default.compareSync(userPassword, databasePassword);
}
module.exports = {
    comparePass: comparePass
};
