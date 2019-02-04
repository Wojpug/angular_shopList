export interface PagedResponse<T> {
    list: T[],
    count: number,
}