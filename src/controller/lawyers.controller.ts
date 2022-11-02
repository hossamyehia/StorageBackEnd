
import { NextFunction, Request, Response } from 'express';
import lawyerService from '../service/lawyer.service';
import { handleResponse } from '../util/helper.util';

async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        await handleErrors(req);
        return await lawyerService.insertUser(req.body.username, req.body.password, req.body.name)
    } catch (err: Error | any) {
        handleResponse(res, 409, "Conflict", [], [err])
    }
}

function loginRequired(req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json({ status: 'Please log in' });
    return next();
}

function loginRedirect(req: Request, res: Response, next: NextFunction) {
    if (req.user) return res.status(401).json({ status: 'You are already logged in' });
    return next();
}

/** Helper Functions */

function handleErrors(req: Request) {
    return new Promise<void>((resolve, reject) => {
        if (req.body.username.length < 6) {
            reject({
                message: 'Username must be longer than 6 characters'
            });
        }
        else if (req.body.password.length < 6) {
            reject({
                message: 'Password must be longer than 6 characters'
            });
        } else {
            resolve();
        }
    });
}

export default {
    createUser,
    loginRequired,
    loginRedirect,
}