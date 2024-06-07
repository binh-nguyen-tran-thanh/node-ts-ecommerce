import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomError } from "./customError";

interface IFourZeroFourErrorParams {
  code?: number;
  message?: string;
}

export default class FourZeroFourError extends CustomError {
  private readonly _statusCode: number;

  constructor({ code, message }: IFourZeroFourErrorParams) {
    super(message || ReasonPhrases.NOT_FOUND);

    this._statusCode = code || StatusCodes.NOT_FOUND;
    Object.setPrototypeOf(this, FourZeroFourError.prototype);
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
