export interface DataDTO<T> {
    message: string;
    success: boolean;
    data: T;
}