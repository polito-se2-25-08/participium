export type ApiResponse<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			data: ErrorResponse;
	  };
export interface ErrorResponse {
	message: string;
}
