import { Request,Response,NextFunction } from "express";
import { countItems, findForAPIs } from "../documents/document.service";
import HttpException from "../shared/models/HttpException.model";

export interface DocumentForAPI {
    id: number,
    closed: boolean,
    tagged: boolean,
    ratified: boolean,
    location: number
}

export interface RequestWithDoucment extends Request{
    document: DocumentForAPI
}

const setDocumentObject = (req: Request, res: Response, next: NextFunction) => {
    findForAPIs(req.params.id as unknown as number).then( (document: any) =>{
        if(!document) return next(new HttpException(404, "Document Not Found"));
        req.document = document as DocumentForAPI;
        next();
    }).catch((err: Error) => {
        next(new HttpException(500, err.message));
    })
}

export function isEmpty(req: Request, res: Response, next: NextFunction){
    countItems(req.document.id).then( (count: any) =>{
        if(!count["count"]) return next(new HttpException(409, "Document is Empty, Can`t Complete the Operation"));
        next();
    }).catch((err: Error) => {
        next(new HttpException(500, err.message));
    })
}

export function isOpen(req: Request, res: Response, next: NextFunction){
    if(req.document.closed) return next(new HttpException(400, "Document is Closed")); 
    next();
}

export function isClosed(req: Request, res: Response, next: NextFunction){
    if(!req.document.closed) return next(new HttpException(400, "Document still Open")); 
    next();
}

export function isUnratified(req: Request, res: Response, next: NextFunction){
    if(req.document.ratified) return next(new HttpException(400, "Document is already ratified")); 
    next();
}

export function isUntagged(req: Request, res: Response, next: NextFunction){
    if(req.document.tagged) return next(new HttpException(400, "Document is already tagged")); 
    next();
}

export default setDocumentObject;