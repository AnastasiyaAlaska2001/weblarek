import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export type BasketEvent =
  | "item:added"
  | "item:removed"
  | "basket:updated"
  | "basket:cleared";

export class ShoppingCart {
  private items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  getItems(): IProduct[] {
    // Возвращаем неизменяемую копию массива
    return this.items.slice();
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => {
      const price = typeof item.price === "number" ? item.price : 0;
      return sum + price;
    }, 0);
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    // Сначала уведомляем о добавлении конкретного товара, затем об общем обновлении корзины
    this.events.emit("item:added", product);
    this.events.emit("basket:updated", [...this.items]);
  }

  removeItemById(id: string | number): void {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.removeItem(this.items[index]);
    }
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex((item) => item.id === product.id);
    if (index === -1) return;

    const removedItem = this.items.splice(index, 1)[0];
    this.events.emit("item:removed", removedItem);
    this.events.emit("basket:updated", [...this.items]);
  }

  clearData(): void {
    const previousItems = [...this.items];
    this.items = [];
    this.events.emit("basket:cleared", previousItems);
    this.events.emit("basket:updated", []);
  }
}
