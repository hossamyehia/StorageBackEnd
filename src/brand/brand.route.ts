import { Router } from "express";

import brandController from "./brand.controller";

const brandAPI = Router();

//  Get Brands By Type || Get All Brands
brandAPI.route("/")
.get( brandController.getBrands);

// Add Brand
brandAPI.route("/addbrand")
.post( brandController.validate, brandController.addBrand);

//  Get, Update, Delete Specific brand
brandAPI.route("/:id")
.get( brandController.getBrandByID)
.put( brandController.filterBody, brandController.editBrand )
.delete( brandController.deleteBrand );


export default brandAPI;
