import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export interface IProducts {
  setProducts(products: IProduct[]): void;
  setSelectedProduct(item: IProduct): void;
  getSelectedProduct(): IProduct | null;
  getProducts(): IProduct[];
  getProductById(id: string): IProduct | undefined;
}

export class ProductCatalog implements IProducts {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    // Сохраняем копию массива, чтобы избежать внешних мутаций
    this.products = [...products];
    this.events.emit("products:updated", this.products);
  }

  public setSelectedProduct(item: IProduct): void {
    this.selectedProduct = item;
    // Явно уведомляем систему об изменении выбранного товара
    this.events.emit("preview:changed");
  }

  public getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }

  getProducts(): IProduct[] {
    // Возвращаем копию, чтобы внешний код не мог случайно изменить внутренний массив
    return [...this.products];
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }
}
