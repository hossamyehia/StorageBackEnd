
import { NextFunction, Request, Response } from 'express';
import passport from '../config/passport.config';
import HttpException from '../model/HttpException.model';
import { getToken } from '../service/auth.service';
import { insertUser } from '../service/user.service';
import { handleResponse, isIDValid, isPasswordValid, isPhoneValid, isUsernameValid } from '../util/helper.util';


export function register(req: Request, res: Response, next: NextFunction) {

    insertUser(req.body.username, req.body.password, req.body.name, req.body.type)
    .then((user) => {
        passport.authenticate("local")(req, res, () => {
            handleResponse(res, 201, true, "Register Successfully");
        });
    }).catch((err: Error) => {
        next(new HttpException(500, err.message));
    });

}


export function login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (err, user, info) => {

        if (err) return next(new HttpException(500, 'Server Error'));
        if (!user) return next(new HttpException(404, 'User Not Found'));

        let token = getToken(user);

        req.login(user, function (err) {
            if (err) { return next(new HttpException(500, err.message)) }
            handleResponse(res, 200, true, 'Login Successfully', [{ token }]);
        });

    })(req, res, next);
}


export function loginRequired(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err, user, info) => {
        if (!user) return next(new HttpException(401, "Please log in"));
        return next();
    })(req, res, next);
}


export function loginRedirect(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err, user, info) => {
        if (user) return next(new HttpException(400, "logged in already"));
        return next();
    })(req, res, next);
}


export function validate(req: Request, res: Response, next: NextFunction) {
    let username = req.body.username || '';
    if (!isUsernameValid(username)) return next(new HttpException(409, "Invalid Username"));
    
    let password = req.body.password || '';
    if (!isPasswordValid(password)) return next(new HttpException(409, "Invalid Password"));

    return next();
}

export function addUser(req: Request, res: Response, next: NextFunction) {
    
}

export function validateInputs(req: Request, res: Response, next: NextFunction) {
    let ID = req.body.id || '';
    if(!isIDValid(ID)) return next(new HttpException(409, "invalid ID"));

    let name = req.body.name || '';
    if(name.length <= 0 || name.length >= 46) return next(new HttpException(409, "Invalid Name"));

    let Phone = req.body.phone || '';
    if(!isPhoneValid(Phone)) return next(new HttpException(409, "Invalid Phone"));

    let address = req.body.name || '';
    if(address.length <= 0 || address.length >= 46) return next(new HttpException(409, "Invalid Address"));
    
    return next();
}

export default {
    register,
    login,
    loginRequired,
    loginRedirect,
    validate,
    addUser
}