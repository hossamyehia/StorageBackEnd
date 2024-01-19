import { Request, NextFunction, Response } from "express";
import ApiResponse from "../models/apiResponse.model";
import HttpException from "../models/HttpException.model";

/**
 *
 * @param res
 * @param status
 * @param success
 * @param message
 * @param data
 */
export function handleResponse(
  res: Response,
  status: number = 200,
  success: boolean,
  message: string,
  data?: Array<object>
) {
  "use strict";
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(status).json(
    Response({
      success,
      message,
      data,
    })
  );
}

const Response = (payload = {}) => {
  return new ApiResponse(payload);
};

export function errorHandler(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): any {
  handleResponse(res, error.status, false, error.message, []);
}

export function camelize(str: string) {
  return str.replace(/\W+(.)/g, function (match, chr) {
    return ' ' + chr.toUpperCase();
  })
}

export function groupBy(xs: any[], key: string | number) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export function validateKeys(obj: any, keys: string[]) {
  for (let key of keys) {
    if (!(key in obj)) return false;
  }
  return true;
}

export function filterObject(obj: any, keys: string[]) {
  return new Promise((resolve, reject) => {
    resolve(
      Object.keys(obj)
        .filter((key) => keys.includes(key))
        .reduce((cur, key) => {
          return Object.assign(cur, { [key]: obj[key] });
        }, {})
    );
  });
}