import { NextFunction, Request, Response } from "express";
import HttpException from "../shared/models/HttpException.model";
import {
  deleteRole,
  find,
  findByRole,
  insertRole,
  updateRole,
} from "./role.service";
import {
  filterObject,
  handleResponse,
  validateKeys,
} from "../shared/util/helper.util";
import SQLError from "../shared/models/SQLError.model";

/**
 * Add New Role
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function addRole(req: Request, res: Response, next: NextFunction) {
  insertRole(req.body.role, req.body.title, req.body.permission)
    .then((done: any) => {
      handleResponse(res, 201, true, "Added Successfully");
    })
    .catch((err: SQLError) => {
      if (err.errno === 1062)
        next(new HttpException(409, "Role Already exist"));
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get All Roles
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getRoles(req: Request, res: Response, next: NextFunction) {
  find()
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get Role By Role Tag
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getByRole(req: Request, res: Response, next: NextFunction) {
  findByRole(req.params.tag)
    .then((result: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", [result]);
    })
    .catch((err) => {
      next(new HttpException(500, err.message));
    });
}

/**
 * Edit Role
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function editRole(req: Request, res: Response, next: NextFunction) {
  updateRole(
    req.params.tag,
    req.body as { title?: string; permission?: string }
  )
    .then((result) => {
      if (!result) return next(new HttpException(404, "Role Not Found"));
      handleResponse(res, 200, true, "Updated Successfully");
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Remove Role
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function removeRole(req: Request, res: Response, next: NextFunction) {
  deleteRole(req.params.tag)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Role Not Found"));
      handleResponse(res, 200, true, "Deleted Successfully");
    })
    .catch((err) => {
      if (err.errno === 1451)
        return next(new HttpException(409, "Role is used by another table"));
      next(new HttpException(500, err.message));
    });
}

/**
 * Validate All Input Existant
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function validate(req: Request, res: Response, next: NextFunction) {
  if (!validateKeys(req.body, ["role", "title", "permission"]))
    next(new HttpException(422, "Please Fill All Inputs"));
  next();
}

/**
 * Filter Body
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function filterBody(req: Request, res: Response, next: NextFunction) {
  filterObject(req.body, ["role", "title", "permission"]).then((body: any) => {
    if (!Object.keys(body).length)
      next(new HttpException(400, "There is no Data To Update"));
    req.body = body;
    next();
  });
}

export default {
  addRole,
  editRole,
  removeRole,
  getRoles,
  getByRole,
  validate,
  filterBody,
};
