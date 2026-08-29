import { Events, ILot, ILotCategory } from "../../types";
import { IEvents } from "../base/events";
import { Model } from "../base/Model";

class LotItem extends Model<ILot> {
  id: string;
  title: string;
  description: string;
  image: string;
  category: ILotCategory;
  price: number;
  isOrdered: boolean = false;

  constructor(data: ILot, events: IEvents) {
    super(data, events);

    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.image = data.image;
    this.category = data.category;
    this.price = data.price ?? 0;
  }

  placeInBasket(): void {
    this.isOrdered = true;
    this.emitChanges(Events.CHANGE_LOT_IN_BASKET, {
      isOrdered: this.isOrdered,
    });
  }

  removeFromBasket(): void {
    this.isOrdered = false;
    this.emitChanges(Events.CHANGE_LOT_IN_BASKET, {
      isOrdered: this.isOrdered,
    });
  }
}

export { LotItem };
