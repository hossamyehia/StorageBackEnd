import { Router, Request, Response } from "express";
import userAPI from "../User/user.route";
import itemAPI from "../Item/item.route";
import userController from "../User/user.controller";
import brandAPI from "../brand/brand.route";
import locationAPI from "../location/location.route";
import categoryAPI from "../category/category.route";
import roleAPI from "../role/role.route";
import documentAPI from "../documents/document.route";
import routePermission from "../middleware/permission.middleware";
import * as crypto from "crypto";
import testAPI from "./test.route";

const apiRoutes = Router();

apiRoutes.route('/').get(async (req: Request, res: Response, next: any) => {
    res.json({id: "Gen-" + crypto.randomBytes(3).toString("hex"), author: "Hossam Yahia Abd elkader Abd elmoanem"})
});

apiRoutes.use('/user', userAPI)
apiRoutes.use('/items', userController.loginRequired, routePermission, itemAPI);
apiRoutes.use('/brand', userController.loginRequired, routePermission, brandAPI);
apiRoutes.use('/location', userController.loginRequired, routePermission, locationAPI);
apiRoutes.use('/category', userController.loginRequired, routePermission, categoryAPI);
apiRoutes.use('/role', userController.loginRequired, routePermission, roleAPI);
apiRoutes.use('/document', userController.loginRequired, routePermission, documentAPI);
apiRoutes.use("/test", userController.loginRequired, testAPI);

/*
/items
/brand
/location
/category
/role
/document
*/

export default apiRoutes;