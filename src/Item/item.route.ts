import { Router } from "express";

import itemController from "./item.controller";

const itemAPI = Router();

itemAPI.route("/")
.get( itemController.getItems );

itemAPI.route('/type')
.get(itemController.getByType)

itemAPI.route("/additem")
.post( itemController.validate, itemController.addItem);

itemAPI.route("/:SID")
.get( itemController.getByID)
.put( itemController.filterBody, itemController.editItem)
.delete(itemController.deleteItem);

export default itemAPI;
