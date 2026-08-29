import _ from "lodash";
import { Events, IAppState, ILot, IOrder } from "../../types";
import { Model } from "../base/Model";
import { IEvents } from "../base/events";
import { LotItem } from "./LotItem";
import { Order } from "./Order";

class AppState extends Model<IAppState> {
  private _catalog: ILot[];
  private _order: IOrder;
  private _preview: ILot;

  constructor(data: Partial<IAppState>, events: IEvents) {
    super(data, events);
  }

  set catalog(items: ILot[]) {
    console.log(items);

    this._catalog = items.map((item) => new LotItem(item, this.events));
    this.emitChanges(Events.LOAD_LOTS, { catalog: this.catalog });
  }

  get catalog(): ILot[] {
    return this._catalog;
  }

  get basket(): ILot[] {
    return this._catalog.filter((item) => item.isOrdered);
  }

  get order(): IOrder {
    return this._order;
  }

  get preview(): ILot {
    return this._preview;
  }

  set preview(value: ILot) {
    this._preview = value;
    this.emitChanges("preview:changed", this.preview);
  }

  isLotInBasket(item: ILot): boolean {
    return item.isOrdered;
  }

  clearBasket(): void {
    this.basket.forEach((lot) => lot.removeFromBasket());
  }

  getTotalAmount(): number {
    return this.basket.reduce((a, c) => a + c.price, 0);
  }

  getBasketIds(): string[] {
    return this.basket.map((item) => item.id);
  }

  getBasketLength(): number {
    return this.basket.length;
  }

  initOrder(): IOrder {
    this._order = new Order({}, this.events);
    this.order.clearOrder();
    return this.order;
  }
}

export { AppState };
