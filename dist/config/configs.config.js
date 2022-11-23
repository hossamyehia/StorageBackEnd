"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    PORT: process.env.PORT || 3000,
    DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
    DATABASE_PORT: process.env.DATABASE_PORT || 3306,
    DATABASE_NAME: process.env.DATABASE_NAME || "office",
    DATABASE_USERNAME: process.env.DATABASE_USERNAME || "",
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "",
    SECRET: process.env.SECRET || ""
};
