export interface HttpAdpter {
  get<T>(url:string) : Promise<T>;
}