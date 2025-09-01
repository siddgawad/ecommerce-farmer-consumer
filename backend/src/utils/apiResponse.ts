export interface ApiMeta {
    [key: string]: unknown;
  }
  
  export default class ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    meta?: ApiMeta;
  
    constructor(success: boolean, message: string, data: T | null = null, meta?: ApiMeta) {
      this.success = success;
      this.message = message;
      this.data = data;
      this.meta = meta;
    }
  }
