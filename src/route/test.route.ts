import { Request, Response, NextFunction, Router } from "express";
import { db } from "../config/database.config";
import knex from "knex";

const testAPI = Router();

//  TEST DB "Knex"
testAPI
  .route("/")
  .get((req: Request, res: Response, next: NextFunction) => {
    res.json({ Done: "DONE" });
  })
  .put((req: Request, res: Response, next: NextFunction) => {
    res.json({ Done: "DONE" });
  })
  .post((req: Request, res: Response, next: NextFunction) => {
    res.json({ Done: "DONE" });
  })
  .delete((req: Request, res: Response, next: NextFunction) => {
    res.json({ Done: "DONE" });
  });

testAPI
  .route("/:any")
  .get((req: Request, res: Response, next: NextFunction) => {
    res.json({ Done: "DONE" });
  })
  .put((req: Request, res: Response, next: NextFunction) => {
    res.json({ Done: "DONE" });
  })
  .post((req: Request, res: Response, next: NextFunction) => {
    res.json({ Done: "DONE" });
  })
  .delete((req: Request, res: Response, next: NextFunction) => {
    res.json({ Done: "DONE" });
  });

export default testAPI;
