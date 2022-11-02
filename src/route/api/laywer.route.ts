import { Router, Request, Response, NextFunction } from "express";
import passport from '../../config/passport.config';

import { handleResponse } from "../../util/helper.util";
import lawyerController from "../../controller/lawyers.controller";

const lawyerAPI = Router();

lawyerAPI.route("/").all(async (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404);
});

lawyerAPI.route("/login")
    .post(
        lawyerController.loginRedirect,
        async (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate('local', (err, user, info) => {
                if (err) { 
                    handleResponse(res, 500, 'error'); 
                }
                if (!user) { handleResponse(res, 404, 'User not found'); }
                if (user) {
                    handleResponse(res, 200, 'success');
                    req.logIn(user, function (err) {
                        if (err) { handleResponse(res, 500, 'error'); }
                        
                    });
                    
                }
            })(req, res, next);
        }
    );

lawyerAPI.route("/register")
    .post(
        lawyerController.loginRedirect,
        async (req: Request, res: Response, next: NextFunction) => {
            return lawyerController
                .createUser(req, res, next)
                .then((response) => {
                    passport.authenticate("local", (err, user, info) => {
                        if (user) {
                            handleResponse(res, 200, "success");
                        }
                    })(req, res, next);
                })
                .catch((err) => {
                    handleResponse(res, 500, "error", ...[], [err]);
                });
        }
    );

export default lawyerAPI;
