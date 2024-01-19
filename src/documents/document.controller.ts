import { NextFunction, Request, Response } from "express";
import HttpException from "../shared/models/HttpException.model";
import {
  appendItem,
  closeDocument,
  createDocument,
  find,
  findByCustodian,
  findById,
  findDetails,
  findOpenByCustodian,
  popItem,
  ratify,
  removeDocument,
  tag,
  updateDocument,
} from "./document.service";
import { updateItemsLocation } from "../Item/item.service";
import {
  filterObject,
  handleResponse,
  validateKeys,
} from "../shared/util/helper.util";
import SQLError from "../shared/models/SQLError.model";

/**
 * Open Document
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function openDocument(req: Request, res: Response, next: NextFunction) {
  createDocument(
    req.body.rank,
    req.body.name,
    req.body.sid,
    req.body.custodian,
    req.body.location
  )
    .then((document: any) => {
      handleResponse(res, 201, true, "Created Successfully");
    })
    .catch((err: SQLError) => {
      if (err.errno === 1062)
        return next(new HttpException(409, "Document already Added"));
      else if (err.errno === 1452)
        return next(new HttpException(409, "Category Not Found"));
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get All Documents
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getDocuments(req: Request, res: Response, next: NextFunction) {
  find()
    .then((documents: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", documents);
    })
    .catch((err) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get By Custodian
 * @param req
 * @param res
 * @param next
 */
export function getByCustodian(
  req: Request,
  res: Response,
  next: NextFunction
) {

  findByCustodian(parseInt(req.params.id))
    .then((documents: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", documents);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get By Custodian
 * @param req
 * @param res
 * @param next
 */
export function getOpenByCustodian(
  req: Request,
  res: Response,
  next: NextFunction
) {

  findOpenByCustodian(parseInt(req.params.id))
    .then((documents: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", documents);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get Specific Document
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getDocumentByID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  findById(parseInt(req.params.id))
    .then((document: any) => {
      if (!document) return next(new HttpException(404, "Document Not Found"));
      handleResponse(res, 200, true, "Retrieved Successfully", [document]);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Edit Specific Document
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function editDocument(req: Request, res: Response, next: NextFunction) {
  updateDocument(req.document.id, req.body)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Document Not Found"));
      handleResponse(res, 200, true, "Updated Successfully");
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Delete Document
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function deleteDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  removeDocument(req.document.id)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Document Not Found"));
      handleResponse(res, 200, true, "Deleted Successfully");
    })
    .catch((err: SQLError) => {
      if (err.errno == 1451) return next(new HttpException(409, "Doucment isn`t Empty"));
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Close Document
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function finishDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  closeDocument(req.document.id)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Document Not Found"));
      handleResponse(res, 200, true, "Closed Successfully");
    })
    .catch((err: Error) => {
      next(new HttpException(500, err.message));
    });
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function ratifyDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  ratify(req.document.id, req.user?.id)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Document Not Found"));
      next();
    })
    .catch((err) => {
      next(new HttpException(500, err.message));
    });
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function applyTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  findDetails(req.document.id)
    .then((items) => {
      if (Array.isArray(items) && items.length == 0)
        return next(
          new HttpException(404, "Document Not Found Or Document is Empty")
        );
      updateItemsLocation(items as any, req.document.location, req.document.id)
        .then((values) => {
          handleResponse(res, 200, true, "Ratified Successfully");
        })
        .catch((err) => {
          next(new HttpException(500, err.message));
        });
    })
    .catch((err) => {
      next(new HttpException(500, err.message));
    });
}

/**
 * Tag Document
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function tagDocument(req: Request, res: Response, next: NextFunction) {
  tag(req.document.id, req.user?.id)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Document Not Found"));
      handleResponse(res, 200, true, "Tagged Successfully");
    })
    .catch((err) => {
      next(new HttpException(500, err.message));
    });
}

/*******   Items Section  *********/

/**
 * Add Item To Specific Document
 * @param req
 * @param res
 * @param next
 */
export function addItem(req: Request, res: Response, next: NextFunction) {
  appendItem(req.document.id, req.body.item_id, req.body.quantity)
    .then((data) => {
      handleResponse(res, 201, true, "Added Successfully");
    })
    .catch((err: SQLError) => {
      if(err.errno == 1062) return next(new HttpException(409, "Item Already Added"));
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get Items in Specific Document
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getItems(req: Request, res: Response, next: NextFunction) {
  findDetails(req.document.id)
    .then((items: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", items);
    })
    .catch((err: Error) => {
      next(new HttpException(500, err.message));
    });
}

/**
 * Remove Item From Document
 * @param req
 * @param res
 * @param next
 */
export function removeItem(req: Request, res: Response, next: NextFunction) {
  if (!req.body.item_id)
    return next(new HttpException(422, "Please Fill All Inputs"));
  popItem(req.document.id, req.body.item_id)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Item Not Found"));
      handleResponse(res, 200, true, "Removed Successfully");
    })
    .catch((err: Error) => {
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
  if (!validateKeys(req.body, ["rank", "name", "sid", "custodian", "location"]))
    next(new HttpException(422, "Please Fill All Inputs"));
  next();
}

/**
 * Validate All Input Existant
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function validateItems(req: Request, res: Response, next: NextFunction) {
  if (!validateKeys(req.body, ["item_id", "quantity"]))
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
  filterObject(req.body, ["rank", "name", "sid", "location"]).then(
    (body: any) => {
      if (!Object.keys(body).length)
        next(new HttpException(400, "There is no Data To Update"));
      req.body = body;
      next();
    }
  );
}

export default {
  openDocument,
  getDocuments,
  getByCustodian,
  getOpenByCustodian,
  getDocumentByID,
  editDocument,
  deleteDocument,
  finishDocument,
  ratifyDocument,
  applyTransaction,
  tagDocument,
  addItem,
  getItems,
  removeItem,
  validate,
  validateItems,
  filterBody,
};
