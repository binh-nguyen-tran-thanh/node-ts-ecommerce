interface BaseResponse {
  status: number;
  isSuccess: boolean;
}

export interface ErrorResponse<T> extends BaseResponse {
  message: string;
}

export interface SuccessResponseWithData<T> extends BaseResponse {
  data: T;
}

export interface SuccessResponseWithoutData<T> extends BaseResponse {}

export interface SuccessResponseWithDataAndPaging<T>
  extends SuccessResponseWithData<T> {
  page: number;
  lastPage: boolean;
}
