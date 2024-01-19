import { Router, Request, Response, NextFunction } from "express";

import userController from "../../controller/user.controller";

const userAPI = Router();

userAPI.route("/").all( userController.loginRequired ,async (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404);
});

userAPI.route("/login")
.post( userController.loginRedirect, userController.validate, userController.login);

userAPI.route("/register")
.post( userController.loginRedirect, userController.validate, userController.register);

export default userAPI;
