import { Request, NextFunction, Response } from "express";
import ApiResponse from "../model/apiResponse.model";
import HttpException from "../model/HttpException.model";

/**
 * 
 * @param res 
 * @param status 
 * @param success 
 * @param message 
 * @param data 
 */
export function handleResponse(res: Response, status: number = 200, success: boolean, message: string, data?: Array<object>) {
    'use strict';
    res.status(status)
        .json(Response({
            success,
            message,
            data,
        }));
}

const Response = (payload = {}) => {
    return new ApiResponse(payload);
}


export function errorHandler(error: HttpException, req: Request, res: Response, next: NextFunction): any {
    handleResponse(res, error.status, false, error.message, [])
};

export function isUsernameValid(username: string) {
    const res = /^[a-z0-9_]+$/.exec(username);
    const valid = !!res;
    return valid;
}

export function isPasswordValid(password: string) {
    const res = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.exec(password);
    const valid = !!res;
    return valid;
}