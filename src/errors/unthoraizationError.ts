import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomError } from "./customError";

interface IUnauthorizedErrorParams {
  code?: number;
  message?: string;
}

export default class UnauthorizedError extends CustomError {
  private readonly _statusCode: number;

  constructor({ code, message }: IUnauthorizedErrorParams) {
    super(message || ReasonPhrases.UNAUTHORIZED);

    this._statusCode = code || StatusCodes.UNAUTHORIZED;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
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
