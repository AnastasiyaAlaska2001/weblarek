import { Component } from "../base/Component";

export class Card extends Component<any> {
  protected titleElement: HTMLElement | null = null;
  protected priceElement: HTMLElement | null = null; //После удаления полей из базового класса. Перестало открываться превью карточек. Укажите в чем проблема

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector(".card__title");
    this.priceElement = container.querySelector(".card__price");
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  set price(value: number | null) {
    if (!this.priceElement) return;

    if (value == null) {
      this.priceElement.textContent = "Бесценно";
      this.priceElement.classList.add("card__price--unavailable");
      this.priceElement.classList.remove("card__price--available");
    } else {
      this.priceElement.textContent = `${value} синапсов`;
      this.priceElement.classList.add("card__price--available");
      this.priceElement.classList.remove("card__price--unavailable");
    }
  }

  render(
    data?: Partial<{
      title: string;
      price: number | null;
    }>,
  ): HTMLElement {
    if (!data) return this.container;

    if ("title" in data && data.title !== undefined) {
      this.title = data.title;
    }
    if ("price" in data && data.price !== undefined) {
      this.price = data.price;
    }

    return this.container;
  }
}
