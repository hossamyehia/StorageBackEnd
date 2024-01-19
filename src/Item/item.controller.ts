import { NextFunction, Request, Response } from "express";
import HttpException from "../shared/models/HttpException.model";
import {
  insertItem,
  findById,
  findByType,
  updateItem,
  find,
  removeItem,
} from "./item.service";
import {
  addQuantity as aqBrand,
  findById as fiBrand,
} from "../brand/brand.service";
import { addQuantity as aqCate } from "../category/category.service";
import {
  filterObject,
  handleResponse,
  validateKeys,
} from "../shared/util/helper.util";
import SQLError from "../shared/models/SQLError.model";

export function addItem(req: Request, res: Response, next: NextFunction) {
  insertItem(
    req.body.SID,
    req.body.brand_id,
    req.body.status,
    req.body.quantity,
    req.body.edara,
    req.body.location,
    req.body.addedBy
  )
    .then((item: any) => {
      handleResponse(res, 201, true, "Added Successfully");
      aqBrand(req.body.brand_id, req.body.quantity).then((done: any) => {
        fiBrand(req.body.brand_id).then((brand: any) => {
          aqCate(brand.type, req.body.quantity);
        });
      });
    })
    .catch((err: Error) => {
      if (err.message === "Item already Added")
        next(new HttpException(409, err.message));
      next(new HttpException(500, err.message));
    });
}

export function getItems(req: Request, res: Response, next: NextFunction) {
  find()
    .then((items: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", items);
    })
    .catch((err: Error) => {
      next(new HttpException(500, err.message));
    });
}

export function getByID(req: Request, res: Response, next: NextFunction) {
  findById(req.params.SID)
    .then((item: any) => {
      if (!item) next(new HttpException(404, "Item Not Found"));
      handleResponse(res, 200, true, "Retrieved Successfully", [item]);
    })
    .catch((err: Error) => {
      next(new HttpException(500, err.message));
    });
}

export function getByType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.query.type) next(new HttpException(422, "Type is missing in query"));

  findByType(req.query.type as unknown as number)
    .then((items: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", items);
    })
    .catch((err: Error) => {
      next(new HttpException(500, err.message));
    });
}

export function editItem(req: Request, res: Response, next: NextFunction) {
  updateItem(req.params.SID, req.body)
    .then((items: any) => {
      handleResponse(res, 200, true, "Updated Successfully", items);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

export function deleteItem(req: Request, res: Response, next: NextFunction) {
  removeItem(req.params.SID)
    .then((items: any) => {
      handleResponse(res, 200, true, "Deleted Successfully", items);
    })
    .catch((err: SQLError) => {
      if (err.errno === 1451)
        return next(
          new HttpException(409, "item is used by another table")
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
  if (
    !validateKeys(req.body, [
      "SID",
      "brand_id",
      "edara",
      "status",
      "quantity",
      "location",
    ])
  )
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
  filterObject(req.body, [
    "SID",
    "brand_id",
    "status",
    "edara",
    "quantity",
    "location",
  ]).then((body: any) => {
    if (!Object.keys(body).length)
      next(new HttpException(400, "There is no Data To Update"));
    req.body = body;
    next();
  });
}

export default {
  addItem,
  editItem,
  deleteItem,
  getItems,
  getByID,
  getByType,
  validate,
  filterBody,
};
