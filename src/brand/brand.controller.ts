import { NextFunction, Request, Response } from "express";
import HttpException from "../shared/models/HttpException.model";
import {
  findById,
  find,
  findByType,
  insertBrand,
  updateBrand,
  removeBrand,
} from "./brand.service";
import {
  filterObject,
  handleResponse,
  validateKeys,
} from "../shared/util/helper.util";
import SQLError from "../shared/models/SQLError.model";

/**
 * Add Brand
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function addBrand(req: Request, res: Response, next: NextFunction) {
  insertBrand(
    req.body.name,
    req.body.model,
    req.body.type,
    req.body.quantityType
  )
    .then((result: any) => {
      handleResponse(res, 201, true, "Added Successfully");
    })
    .catch((err: SQLError) => {
      if (err.errno === 1062)
        return next(new HttpException(409, "Brand already Added"));
      else if (err.errno === 1452)
        return next(new HttpException(409, "Category Not Found"));
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get Brands By Type || Get All Brands
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getBrands(req: Request, res: Response, next: NextFunction) {
  if (parseInt(req.query.type as string)) {
    findByType(req.query.type as unknown as number)
      .then((results: any) => {
        handleResponse(res, 200, true, "Retrieved Successfully", results);
      })
      .catch((err: SQLError) => {
        next(new HttpException(500, err.sqlMessage));
      });
  } else {
    find()
      .then((results: any) => {
        handleResponse(res, 200, true, "Retrieved Successfully", results);
      })
      .catch((err: SQLError) => {
        next(new HttpException(500, err.sqlMessage));
      });
  }
}

/**
 * Get Specific Brand
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getBrandByID(req: Request, res: Response, next: NextFunction) {
  findById(parseInt(req.params.id))
    .then((result: any) => {
      if (!result) return next(new HttpException(404, "Brand Not Found"));
      handleResponse(res, 200, true, "Retrieved Successfully", [result]);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Edit Brand Data
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function editBrand(req: Request, res: Response, next: NextFunction) {
  updateBrand(parseInt(req.params.id), req.body)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Brand Not Found"));
      handleResponse(res, 200, true, "Updated Successfully");
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Delete Specific Brand
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function deleteBrand(req: Request, res: Response, next: NextFunction) {
  removeBrand(parseInt(req.params.id))
    .then((result) => {
      if (!result) return next(new HttpException(404, "Brand Not Found"));
      handleResponse(res, 200, true, "Deleted Successfully");
    })
    .catch((err: SQLError) => {
      if (err.errno === 1451)
        return next(
          new HttpException(409, "Brand is used by another table")
        );
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
  if (!validateKeys(req.body, ["name", "model", "type", "quantityType"]))
    return next(new HttpException(422, "Please Fill All Inputs"));
  next();
}

/**
 * Filter Body
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function filterBody(req: Request, res: Response, next: NextFunction) {
  filterObject(req.body, ["name", "model", "type", "quantityType"]).then(
    (body: any) => {
      if (!Object.keys(body).length)
        return next(new HttpException(400, "There is no Data To Update"));
      req.body = body;
      next();
    }
  );
}

export default {
  addBrand,
  editBrand,
  deleteBrand,
  getBrands,
  getBrandByID,
  validate,
  filterBody,
};
