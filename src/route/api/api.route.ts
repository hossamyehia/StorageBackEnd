import { Router, Request, Response } from "express";
import lawyerAPI from "./laywer.route";

const apiRoutes = Router();

apiRoutes.route('/').get(async (req: Request, res: Response, next: any) => {
    res.sendStatus(200)
});


apiRoutes.use('/lawyer', lawyerAPI)


export default apiRoutes;