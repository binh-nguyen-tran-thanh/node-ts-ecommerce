import { Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { SuccessResponseWithData } from "types/response";

export interface IBaseResponse<T> {
  code?: number;
  data: T;
  message?: string;
}

export class BaseResponse<T> {
  private readonly _statusCode: number;
  private readonly _data: T;
  private readonly _message: string;

  constructor({
    code = StatusCodes.OK,
    message = ReasonPhrases.OK,
    data,
  }: IBaseResponse<T>) {
    this._message = message;
    this._statusCode = code;
    this._data = data;
  }

  public sendResponse(res: Response) {
    const responseObj: SuccessResponseWithData<T> = {
      code: this._statusCode,
      data: this._data,
      message: this._message,
      isSuccess: true,
    };

    return res.status(this._statusCode).json(responseObj);
  }
}
