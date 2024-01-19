import { Router, Request, Response, NextFunction } from "express";

import userController from "./user.controller";
import routePermission from "../middleware/permission.middleware";

const userAPI = Router();

userAPI.route("/")
.get( userController.loginRequired , routePermission, userController.getUsers);

userAPI.route("/login")
.post( userController.loginRedirect, /*userController.validate, */userController.login);

userAPI.route("/register")
.post( userController.loginRequired, routePermission,userController.validate, userController.register);

userAPI.route("/:id")
.get(userController.loginRequired , routePermission, userController.getById)
.put( userController.loginRequired, routePermission, userController.filterBody, userController.editUser)
.delete( userController.loginRequired, routePermission, userController.removeUser);

userAPI.route("/logout")
.post( userController.loginRequired, userController.logout);

export default userAPI;
