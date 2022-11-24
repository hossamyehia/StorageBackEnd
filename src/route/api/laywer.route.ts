import { Router, Request, Response, NextFunction } from "express";

import lawyerController from "../../controller/lawyers.controller";

const lawyerAPI = Router();

lawyerAPI.route("/").all( lawyerController.loginRequired ,async (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404);
});

lawyerAPI.route("/login")
.post( lawyerController.loginRedirect, lawyerController.validate, lawyerController.login);

lawyerAPI.route("/register")
.post( lawyerController.loginRedirect, lawyerController.validate, lawyerController.register);

export default lawyerAPI;
