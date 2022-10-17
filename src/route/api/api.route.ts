import { Router, Request, Response } from "express";

export const apiRoutes = Router();

apiRoutes.route('/').get((req: Request, res: Response, next: any) => {
    res.sendStatus(200)
})