import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomError } from "./customError";

interface IForbiddenErrorParams {
  code?: number;
  message?: string;
}

export default class ForbiddenError extends CustomError {
  private readonly _statusCode: number;

  constructor({ code, message }: IForbiddenErrorParams) {
    super(message || ReasonPhrases.FORBIDDEN);

    this._statusCode = code || StatusCodes.FORBIDDEN;
    Object.setPrototypeOf(this, ForbiddenError.prototype);
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
