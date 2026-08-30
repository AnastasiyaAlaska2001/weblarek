import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { CardBasket } from "./CardBasket";
import { cloneTemplate } from "../../utils/utils";

export class Basket extends Component<any> {
  private totalElement: HTMLElement | null = null;
  private orderButton: HTMLButtonElement | null = null;
  private itemsList: HTMLElement | null = null;
  private cardTemplate: HTMLTemplateElement | null = null;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    // Инициализация DOM-элементов через поиск внутри контейнера или по глобальному ID
    this.totalElement = container.querySelector(".basket__price");
    this.orderButton = container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;
    this.itemsList = container.querySelector(".basket__list");
    this.cardTemplate = document.getElementById(
      "card-basket",
    ) as HTMLTemplateElement | null;

    // Настройка кнопки оформления заказа
    if (this.orderButton) {
      this.orderButton.addEventListener("click", () => {
        this.events.emit("order:open");
      });
      // По умолчанию кнопка неактивна, пока нет товаров
      this.orderButton.disabled = true;
    }
  }

  set items(products: IProduct[]) {
    if (!this.itemsList || !this.cardTemplate) {
      console.warn(
        "[Basket] Не удалось отрисовать товары: отсутствуют элементы списка или шаблон карточки.",
      );
      return;
    }

    // Очищаем список перед перерисовкой
    this.itemsList.innerHTML = "";

    // Создаём карточки для каждого товара
    const renderedCards = products.map((product, index) => {
      const clonedNode = cloneTemplate(this.cardTemplate!);
      const card = new CardBasket(clonedNode, {
        onDelete: () => this.events.emit("basket:remove", product),
      });

      // Заполняем карточку данными
      card.title = product.title;
      card.price = product.price;
      card.index = index + 1;

      return card.render();
    });

    // Вставляем все карточки в список
    if (renderedCards.length > 0) {
      this.itemsList.append(...renderedCards);
    }
  }

  set total(value: number) {
    if (this.totalElement) {
      // Форматируем значение: если 0 — можно показать явно, иначе просто подставляем
      this.totalElement.textContent = value
        ? `${value} синапсов`
        : "0 синапсов";
    }
  }

  set isButtonDisabled(value: boolean) {
    if (this.orderButton) {
      this.orderButton.disabled = value;
    }
  }
}
