import { NextFunction, Request, Response } from "express";
import HttpException from "../shared/models/HttpException.model";
import {
  findById,
  find,
  insertCategory,
  findWithDetails,
  updateCategory,
  removeCategory,
} from "./category.service";
import {
  filterObject,
  handleResponse,
  validateKeys,
} from "../shared/util/helper.util";
import SQLError from "../shared/models/SQLError.model";

/**
 * Add Category
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function addCategory(req: Request, res: Response, next: NextFunction) {
  insertCategory(req.body.name)
    .then((done: any) => {
      handleResponse(res, 201, true, "Added Successfully");
    })
    .catch((err: SQLError) => {
      if (err.errno === 1062) next(new HttpException(409, "Category Already exist"));
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get All Categories
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getCategories(req: Request, res: Response, next: NextFunction) {
  find()
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get Categories With Details
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getCategoriesDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  findWithDetails()
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get Specific Category
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getCategoryByID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  findById(parseInt(req.params.id))
    .then((result: any) => {
      if (!result) return next(new HttpException(404, "Category Not Found"));
      handleResponse(res, 200, true, "Retrieved Successfully", [result]);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Edit Specific Category Data
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function editCategory(req: Request, res: Response, next: NextFunction) {
  updateCategory(parseInt(req.params.id), req.body)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Category Not Found"));
      handleResponse(res, 200, true, "Updated Successfully");
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Delete Specific Category
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  removeCategory(parseInt(req.params.id))
    .then((result) => {
      if (!result) return next(new HttpException(404, "Category Not Found"));
      handleResponse(res, 200, true, "Deleted Successfully");
    })
    .catch((err: SQLError) => {
      if (err.errno == 1451) return next(new HttpException(409, "Category is used by another table"));
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Validate All Input Existant
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function validate(req: Request, res: Response, next: NextFunction) {
  if (!validateKeys(req.body, ["name"]))
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
  filterObject(req.body, ["name"]).then((body: any) => {
    if (!Object.keys(body).length)
      next(new HttpException(400, "There is no Data To Update"));
    req.body = body;
    next();
  });
}

export default {
  addCategory,
  editCategory,
  deleteCategory,
  getCategoryByID,
  getCategories,
  getCategoriesDetails,
  validate,
  filterBody,
};
