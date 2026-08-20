import {
  IApi,
  IOrderRequest,
  TOrderResponse,
  IOrderResultApi,
} from "../../types/index";

export class ServerApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IOrderResultApi> {
    return this.api.get("/product/");
  }

  postOrder(orderRequest: IOrderRequest): Promise<TOrderResponse> {
    return this.api.post("/order/", orderRequest);
  }
}
