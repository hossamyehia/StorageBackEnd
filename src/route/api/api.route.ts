import { Router, Request, Response } from "express";
import userAPI from "./user.route";

const apiRoutes = Router();

apiRoutes.route('/').get(async (req: Request, res: Response, next: any) => {
    res.sendStatus(200)
});

apiRoutes.use('/user', userAPI)

export default apiRoutes;