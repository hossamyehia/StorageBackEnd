import { Router } from "express";

import roleController from "./role.controller";

const roleAPI = Router();

roleAPI.route("/")
//  Get All Roles
.get( roleController.getRoles);

roleAPI.route("/addRole")
//add Role
.post( roleController.validate, roleController.addRole);

//  Get, Update, Delete Specific Role
roleAPI.route("/:tag")
.get( roleController.getByRole )
.put( roleController.filterBody, roleController.editRole )
.delete( roleController.removeRole );

export default roleAPI;