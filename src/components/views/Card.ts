import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";

export class Card extends Component<any> {
  protected titleElement: HTMLElement | null = null;
  protected priceElement: HTMLElement | null = null;
  protected categoryElement: HTMLElement | null = null;
  protected imageElement: HTMLImageElement | null = null;
  protected buyButton: HTMLButtonElement | null = null;

  constructor(container: HTMLElement) {
    super(container);

    // Инициализируем ссылки на внутренние элементы карточки
    this.titleElement = container.querySelector(".card__title");
    this.priceElement = container.querySelector(".card__price");
    this.categoryElement = container.querySelector(".card__category");
    this.imageElement = container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
    this.buyButton = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  set price(value: number | null) {
    if (!this.priceElement) return;

    if (value === null || value === undefined) {
      this.priceElement.textContent = "Бесценно";
      this.priceElement.classList.add("card__price--unavailable");
      this.priceElement.classList.remove("card__price--available");
    } else {
      this.priceElement.textContent = `${value} синапсов`;
      this.priceElement.classList.add("card__price--available");
      this.priceElement.classList.remove("card__price--unavailable");
    }
  }

  set category(value: string) {
    if (!this.categoryElement) return;

    // Сбрасываем модификаторы перед установкой нового
    this.categoryElement.className = "card__category";

    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this.categoryElement.classList.add(modifier);
    }

    this.categoryElement.textContent = value;
  }

  set image(value: string) {
    if (!this.imageElement) return;

    this.imageElement.src = "";
    this.imageElement.alt = "Товар";

    this.imageElement.src = value;
  }

  set text(value: string) {
    const element = this.container.querySelector(".card__text");
    if (element) {
      element.textContent = value;
    }
  }

  render(
    data?: Partial<{
      title: string;
      price: number | null;
      category: string;
      image: string;
      text: string;
    }>,
  ): HTMLElement {
    if (!data) {
      return this.container;
    }

    // Обновляем только те поля, которые переданы в данных
    if ("title" in data && data.title !== undefined) {
      this.title = data.title;
    }
    if ("price" in data && data.price !== undefined) {
      this.price = data.price;
    }
    if ("category" in data && data.category !== undefined) {
      this.category = data.category;
    }
    if ("image" in data && data.image !== undefined) {
      this.image = data.image;
    }
    if ("text" in data && (data as any).text !== undefined) {
      this.text = (data as any).text;
    }

    return this.container;
  }
}
