import { Request, Response, NextFunction } from "express";
import HttpException from "../shared/models/HttpException.model";

/*
Permssions  
0 = none
1 = read
2 = write
4 = Delete - edit
8 = tagged
16 = ratified
---------------------------------------------------------------------------------
Base32:
//////////////////////////////////////////////
Value   0   1   2   3   4   5   6   7   8   9
Symbol  0   1   2   3   4   5   6   7   8   9
//////////////////////////////////////////////
Value   10  11  12  13  14  15  16  17  18  19
Symbol  A   B   C   D   E   F   G   H   I   J
///////////////////////////////////////////////
Value   20  21  22  23  24  25  26  27  28  29
Symbol  K   L   M   N   O   P   Q   R   S   T
//////////////////////////////////////////////
Value   30  31
Symbol  U   V
///////////////////////////////////////////////

//////////////////
INDEXES:
/items      0
/brand      1
/location   2
/category   3
/role       4
/user       5
/document   6
*/

/**
 * Middleware to Filter Requests By Permission Granted to user
 * @param req
 * @param res
 * @param next
 */
export default function routePermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const permission = req.user?.permission || "";
  if (permission == "") next(new HttpException(401, "Please, login"));

  let index = -1; // Request API Index

  if (req.baseUrl == "/api/items") index = 0;
  else if (req.baseUrl == "/api/brand") index = 1;
  else if (req.baseUrl == "/api/location") index = 2;
  else if (req.baseUrl == "/api/category") index = 3;
  else if (req.baseUrl == "/api/role") index = 4;
  else if (req.baseUrl == "/api/user" || req.baseUrl == "/api/user/register")
    index = 5;
  else if (req.baseUrl == "/api/document") index = 6;
  else next(new HttpException(400, "BAD REQUEST"));

  if (req.method == "GET" && parseInt(permission[index], 32) % 2 == 1) next();
  else if (req.method == "POST" && (parseInt(permission[index], 32) & 2) == 2)
    next();
  else if (
    (req.method == "PUT" || req.method == "DELETE") &&
    ((parseInt(permission[index], 32) & 4) == 4 ||
      (parseInt(permission[index], 32) & 8) == 8 ||
      (parseInt(permission[index], 32) & 16) == 16)
  )
    next();
  else if(index == 6 && req.method == "PUT" && (parseInt(permission[index], 32) & 2)  == 2 && /\/\d+\/(close|items)/.exec(req.path) !== null ) next();

  else next(new HttpException(403, "YOU ARE NOT ALLWOED TO USE THIS API"));
}

/**
 * Middleware To Check if User have the Required Permission To Tag
 * @param req
 * @param res
 * @param next
 */
export function canTag(req: Request, res: Response, next: NextFunction) {
  const permission = req.user?.permission || "";
  if (permission == "") next(new HttpException(401, "Please, login"));

  if ((parseInt(permission[6], 32) & 8) == 8) next();
  else next(new HttpException(403, "YOU ARE NOT ALLWOED TO USE THIS API"));
}

/**
 * Middleware To Check if User have the Required Permission To Ratify
 * @param req
 * @param res
 * @param next
 */
export function canRatify(req: Request, res: Response, next: NextFunction) {
  const permission = req.user?.permission || "";
  if (permission == "") next(new HttpException(401, "Please, login"));

  if ((parseInt(permission[6], 32) & 16) == 16) next();
  else next(new HttpException(403, "YOU ARE NOT ALLWOED TO USE THIS API"));
}
