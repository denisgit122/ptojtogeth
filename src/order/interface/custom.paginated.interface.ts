export interface ICustomPaginated<T> {
  data: T[] | any;
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}
