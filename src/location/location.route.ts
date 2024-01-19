import { Router } from "express";

import locationController from "./location.controller";

const locationAPI = Router();

locationAPI.route("/")
.get( locationController.getLocations );

locationAPI.route("/addlocation")
.post( locationController.validate, locationController.addLocation);

locationAPI.route("/:id")
.get( locationController.getByID)
.put( locationController.filterBody, locationController.editLocation)
.delete( locationController.removeLocation);

export default locationAPI;