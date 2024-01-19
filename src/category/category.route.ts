import { Router } from "express";

import categoryController from "./category.controller";

const categoryAPI = Router();

categoryAPI.route("/")
.get( categoryController.getCategories );

categoryAPI.route("/details")
.get( categoryController.getCategoriesDetails );

categoryAPI.route("/addCategory")
.post( categoryController.validate, categoryController.addCategory);

categoryAPI.route("/:id")
.get( categoryController.getCategoryByID )
.put( categoryController.filterBody, categoryController.editCategory )
.delete( categoryController.deleteCategory );

export default categoryAPI;