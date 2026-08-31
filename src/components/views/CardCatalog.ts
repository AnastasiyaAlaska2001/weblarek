import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";

interface ICardActions {
  onBuy: () => void;
}

interface ICardActions {
  onBuy: () => void;
}

export class CardCatalog extends Card {
  private categoryElement: HTMLElement | null = null;
  private imageElement: HTMLImageElement | null = null;
  private buyButton: HTMLButtonElement | null = null;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = container.querySelector(".card__category");
    this.imageElement = container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
    this.buyButton = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;

    if (actions?.onBuy && this.buyButton) {
      const handleBuy = () => actions.onBuy();

      // Клик по карточке (или кнопке) — действие «купить»
      this.container.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleBuy();
      });

      this.buyButton.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleBuy();
        }
      });
    }
  }

  set category(value: string) {
    if (!this.categoryElement) return;

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

  override render(
    data?: Partial<{
      title: string;
      price: number | null;
      category: string;
      image: string;
    }>,
  ): HTMLElement {
    // Сначала рендерим общее (title, price)
    super.render(data);
    if (!data) return this.container;

    // Потом специфичное
    if ("category" in data && data.category !== undefined) {
      this.category = data.category;
    }
    if ("image" in data && data.image !== undefined) {
      this.image = data.image;
    }

    return this.container;
  }
}
