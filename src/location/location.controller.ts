import { NextFunction, Request, Response } from "express";
import HttpException from "../shared/models/HttpException.model";
import {
  findById,
  find,
  insertLocation,
  deleteLocation,
  updateLocation,
} from "./location.service";
import {
  filterObject,
  handleResponse,
  validateKeys,
} from "../shared/util/helper.util";
import SQLError from "../shared/models/SQLError.model";

/**
 * Add New Location
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function addLocation(req: Request, res: Response, next: NextFunction) {
  insertLocation(req.body.name)
    .then((result: any) => {
      handleResponse(res, 201, true, "Added Successfully");
    })
    .catch((err: SQLError) => {
      if (err.errno === 1062)
        next(new HttpException(409, "Location already Added"));
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Gt Specific Location By its ID
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getByID(req: Request, res: Response, next: NextFunction) {
  findById(parseInt(req.params.id))
    .then((result: any) => {
      if (!result) return next(new HttpException(404, "Location Not Found"));
      handleResponse(res, 200, true, "Retrieved Successfully", [result]);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get All Locations
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getLocations(req: Request, res: Response, next: NextFunction) {
  find()
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Edit Specific Location Data
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function editLocation(req: Request, res: Response, next: NextFunction) {
    
  updateLocation(parseInt(req.params.id), req.body as { name?: string })
    .then((result) => {
      if (!result) return next(new HttpException(404, "Location Not Found"));
      handleResponse(res, 200, true, "Updated Successfully");
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Delete Specific Location
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function removeLocation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  deleteLocation(parseInt(req.params.id))
    .then((result) => {
      if (!result) return next(new HttpException(404, "Location Not Found")); 
      handleResponse(res, 200, true, "Deleted Successfully");
    })
    .catch((err) => {
      if (err.errno === 1451)
        return next(new HttpException(409, "Location is used by another table"));
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
  addLocation,
  editLocation,
  removeLocation,
  getByID,
  getLocations,
  validate,
  filterBody,
};
