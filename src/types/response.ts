interface BaseResponse {
  code: number;
  isSuccess: boolean;
}

export interface ErrorResponse extends BaseResponse {
  errors: {
    message: string;
  }[];
}

export interface SuccessResponseWithData<T> extends BaseResponse {
  message: string;
  data: T;
}

export interface SuccessResponseWithoutData<T> extends BaseResponse {
  message: string;
}

export interface SuccessResponseWithDataAndPaging<T>
  extends SuccessResponseWithData<T> {
  page: number;
  lastPage: boolean;
}
