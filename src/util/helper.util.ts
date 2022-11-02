import { ErrorRequestHandler, Response } from "express";


const Response = (payload = {}) => {

    class ApiResponse {
        private Data: Array<object>;
        private Status: number;
        private Errors: Array<Error>;
        private Message: string;

        constructor({ data = [], status = 1, errors = [], message = '' }) {
            this.Data = data;
            this.Status = status;
            this.Errors = errors;
            this.Message = message;
        }

        get data() {
          return this.Data;
        }

        set data(data: Array<object>) {
          this.Data = data;
        }

        get status() {
          return this.Status;
        }

        set status(status: number) {
          this.Status = status;
        }

        get errors() {
          return this.Errors;
        }

        set errors(errors: Array<Error>) {
          this.Errors = errors;
        }

        get message() {
          return this.Message;
        }

        set message(message: string) {
          this.Message = message;
        }

        toJSON() {
            return {
                status: this.status,
                message: this.message,
                data: this.data,
                errors: this.errors.map(e => e.message ? e.message : e),
            }
        }
    }

    return new ApiResponse(payload);

}


export function handleResponse( res : Response, status: number = 200, message: string, data?: Array<object>, errors?: Array<Error>) {
    'use strict';
    res.status(status)
    .json(Response({
        status,
        message,
        data,
        errors,
    }));
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    handleResponse(res, 500, "ERROR", [], [err] )
};

