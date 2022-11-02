import { Router, Request, Response } from "express";
import apiRoutes from './api/api.route';

export const routes = Router();

// middleware that is specific to this router
routes.use((req: Request, res: Response, next: any) => {
    console.log('Time: ', Date.now())
    next()
})

routes.route('/').get((req: Request, res: Response, next: any) => {
    res.sendStatus(200)
})

routes.use('/api', apiRoutes)
  