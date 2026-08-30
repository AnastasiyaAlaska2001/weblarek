import { IApi } from "../types";
import { IOrderPayload, IOrderResponse, IProductsResponse } from "../types";

export class ServerApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

   async getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>("/product/");
  }

  async sendOrder(orderData: IOrderPayload): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", orderData);
  }
}
