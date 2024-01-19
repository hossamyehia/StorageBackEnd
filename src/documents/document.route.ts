import { Router } from "express";

import documentController from "./document.controller";
import setDocumentObject, { isClosed, isEmpty, isOpen, isUnratified, isUntagged } from "../middleware/document.middleware";
import { canRatify, canTag } from "../middleware/permission.middleware";

const documentAPI = Router();

documentAPI.route("/")
//  Open Document
.post( documentController.validate, documentController.openDocument)
//  Get All Documents
.get( documentController.getDocuments);

//  Get Documents By User
documentAPI.route("/custodian/:id")
.get(documentController.getByCustodian)

//  Get Documents By User
documentAPI.route("/custodian/:id/open")
.get(documentController.getOpenByCustodian)

// Get, Edit, Delete Specific Document
documentAPI.route("/:id")
.get( documentController.getDocumentByID )
.put( setDocumentObject, isOpen, documentController.filterBody, documentController.editDocument)
.delete( setDocumentObject, isOpen, documentController.deleteDocument );


//  Close Document
documentAPI.route("/:id/close")
.put( setDocumentObject, isOpen, isEmpty, documentController.finishDocument);

//  Ratify Document
documentAPI.route("/:id/ratify")
.put( canRatify, setDocumentObject, isClosed, isUnratified, documentController.ratifyDocument, documentController.applyTransaction);

//  Tag Document
documentAPI.route("/:id/tag")
.put( canTag, setDocumentObject, isClosed, isUntagged, documentController.tagDocument);


//  Add, Get, Remove Items Route
documentAPI.route('/:id/items')
.post(setDocumentObject, isOpen, documentController.validateItems, documentController.addItem)
.get(setDocumentObject, documentController.getItems)
.put(setDocumentObject, isOpen, documentController.removeItem);


export default documentAPI;