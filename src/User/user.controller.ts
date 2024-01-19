import { NextFunction, Request, Response } from "express";
import passport from "../config/passport.config";
import HttpException from "../shared/models/HttpException.model";
import { getToken } from "../shared/services/auth.service";
import {
  deleteUser,
  find,
  findById,
  insertUser,
  updateUser,
} from "./user.service";
import {
  filterObject,
  handleResponse,
  validateKeys,
} from "../shared/util/helper.util";
import SQLError from "../shared/models/SQLError.model";

/**
 * Register New User
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function register(req: Request, res: Response, next: NextFunction) {
  insertUser(
    req.body.username,
    req.body.password,
    req.body.rank,
    req.body.name,
    req.body.role
  )
    .then((user) => {
      passport.authenticate("local")(req, res, () => {
        handleResponse(res, 201, true, "Register Successfully");
      });
    })
    .catch((err: SQLError) => {
      if (err.errno === 1062)
        return next(new HttpException(409, "Username already exists"));
      else if (err.errno === 1452)
        return next(new HttpException(409, "Role Not Found"));
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Login Controller
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(new HttpException(500, "Server Error"));
    if (!user) {
      if (info.message === "User Not Found.")
        return next(new HttpException(404, "User Not Found"));
      else return next(new HttpException(404, "Incorrect Password."));
    }

    let token = getToken(user);

    req.login(user, function (err) {
      if (err) {
        return next(new HttpException(500, err.message));
      }
      handleResponse(res, 200, true, "Login Successfully", [{ token }]);
    });
  })(req, res, next);
}

/**
 * Logout Controller
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function logout(req: Request, res: Response, next: NextFunction) {
  req.session.destroy(() =>
    handleResponse(res, 200, true, "Logout Successfully")
  );
}

/**
 * Get Specific User
 * @param req
 * @param res
 * @param next
 */
export function getById(req: Request, res: Response, next: NextFunction) {
  findById(parseInt(req.params.id))
    .then((result: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", [result]);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Get Registed Users
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getUsers(req: Request, res: Response, next: NextFunction) {
  find()
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Edit User
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function editUser(req: Request, res: Response, next: NextFunction) {
  updateUser(
    parseInt(req.params.id),
    req.body as { rank?: string, name?: string, username?: string, password?: string }
  )
    .then((result) => {
      if (!result) return next(new HttpException(404, "User Not Found"));
      handleResponse(res, 200, true, "Updated Successfully");
    })
    .catch((err: SQLError) => {
      next(new HttpException(500, err.sqlMessage));
    });
}

/**
 * Remove User
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function removeUser(req: Request, res: Response, next: NextFunction) {
  deleteUser(parseInt(req.params.id))
    .then((result) => {
      if (result) return next(new HttpException(404, "User Not Found")); 
      handleResponse(res, 200, true, "Deleted Successfully");
      
    })
    .catch((err) => {
      if (err.errno === 1451)
        return next(new HttpException(409, "User is used by another table"));
      next(new HttpException(500, err.message));
    });
}

/**
 * Check If User is not logged in
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function loginRequired(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("jwt", (err, user, info) => {
    if (!user) return next(new HttpException(401, "Please log in"));
    req.user = user;
    return next();
  })(req, res, next);
}

/**
 * Check If User is already Logged in
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function loginRedirect(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("jwt", (err, user, info) => {
    if (user) return next(new HttpException(400, "logged in already"));
    return next();
  })(req, res, next);
}

/**
 * Validate All Input Existant
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function validate(req: Request, res: Response, next: NextFunction) {
  if (!validateKeys(req.body, ["rank", "name", "username", "password", "role"]))
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
  filterObject(req.body, ["rank", "name", "username", "password", "role"]).then(
    (body: any) => {
      if (!Object.keys(body).length)
        next(new HttpException(400, "There is no Data To Update"));
      req.body = body;
      next();
    }
  );
}

export default {
  register,
  login,
  logout,
  getById,
  getUsers,
  editUser,
  removeUser,
  validate,
  filterBody,
  loginRequired,
  loginRedirect,
};
