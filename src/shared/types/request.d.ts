
import UserModel from "../models/token.model";
import { DocumentForAPI } from "../../middleware/document.middleware"

declare global {
    namespace Express {
        export interface Request{
            document: DocumentForAPI = {}
        }        
        interface User extends UserModel {
        }
        
    }
}