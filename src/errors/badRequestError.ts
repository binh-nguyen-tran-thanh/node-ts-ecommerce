import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomError, CustomErrorContent } from "./customError";

interface IBadRequestErrorParams {
  code?: number;
  message?: string;
}

export default class BadRequestError extends CustomError {
  private readonly _statusCode: number;

  constructor({ code, message }: IBadRequestErrorParams) {
    super(message || ReasonPhrases.BAD_REQUEST);

    this._statusCode = code || StatusCodes.BAD_REQUEST;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  get statusCode() {
    return this._statusCode;
  }

  get errors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
