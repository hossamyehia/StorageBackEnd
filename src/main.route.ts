import { Router, Request, Response } from "express";
import apiRoutes from './route/api.route';

export const routes = Router();

routes.route('/').get((req: Request, res: Response, next: any) => {
    res.sendStatus(200)
})

routes.use('/api', apiRoutes)
  