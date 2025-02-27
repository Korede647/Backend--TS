"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const http_status_codes_1 = require("http-status-codes");
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            message: "Unauthorized"
        });
    }
};
exports.isAuthenticated = isAuthenticated;
