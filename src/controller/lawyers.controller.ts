
import { NextFunction, Request, Response } from 'express';
import passport from '../config/passport.config';
import HttpException from '../model/HttpException.model';
import { getToken } from '../service/auth.service';
import { insertUser } from '../service/lawyer.service';
import { handleResponse, isPasswordValid, isUsernameValid } from '../util/helper.util';

function register(req: Request, res: Response, next: NextFunction) {

    insertUser(req.body.username, req.body.password, req.body.name)
    .then((user) => {
        passport.authenticate("local")(req, res, () => {
            handleResponse(res, 201, true, "Register Successfully");
        });
    }).catch((err: Error) => {
        next(new HttpException(500, err.message));
    });

}


function login(req: Request, res: Response, next: NextFunction) {
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


function loginRequired(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err, user, info) => {
        if (!user) return next(new HttpException(401, "Please log in"));
        return next();
    })(req, res, next);
}


function loginRedirect(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err, user, info) => {
        if (user) return next(new HttpException(400, "You are already logged in"));
        return next();
    })(req, res, next);
}



/** Helper Functions */
function validate(req: Request, res: Response, next: NextFunction) {
    let username = req.body.username || '';
    if (!isUsernameValid(username)) return next(new HttpException(409, "Username is invalid"));
    
    let password = req.body.password || '';
    if (!isPasswordValid(password)) return next(new HttpException(409, "Password is invalid"));

    next();
}

export default {
    register,
    login,
    loginRequired,
    loginRedirect,
    validate,
}